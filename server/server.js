import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import userRoutes from "./routes/UserRoutes.js";
import directingRoutes from "./routes/DirectingRoutes.js";
import eventRoutes from "./routes/EventRoutes.js";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import {
  createExcelDirection,
  createExcelDirectionMembersOnly,
  createExcelEvent,
} from "./controllers/ExcelGeneration.js";

dotenv.config({ path: "./.env" });
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* CONSTANTS */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/* MIDDLEWARES */
// app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "20mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * @description Загрузка изображений в папку uploads
 * @access public
 */

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Файл не загружен" });
    }
    res.json({ path: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Произошла ошибка при загрузке изображения",
    });
  }
});

/* Generate EXСEL document */
app.get("/excel-direction/:id", async (req, res) => {
  try {
    const filePath = await createExcelDirection(req.params.id);

    res.download(filePath, "table.xlsx", (err) => {
      if (err) {
        console.error("Ошибка при отправке файла:", err);
        res.status(500).send("Ошибка при скачивании файла");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка скачивании файла",
    });
  }
});

app.post("/excel-event/:id", async (req, res) => {
  try {
    const { date, title, person, desc, count, place, listCount } = req.body;
    const filePath = await createExcelEvent(req.params.id, {
      date,
      title,
      person,
      desc,
      count,
      place,
      listCount,
    });

    // Отправить файл как attachment
    res.setHeader("Content-Disposition", "attachment; filename=table.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.sendFile(filePath, { root: "." }, (err) => {
      if (err) {
        console.error("Ошибка при отправке файла:", err);
        res.status(500).send("Ошибка при скачивании файла");
      }
    });
  } catch (error) {
    console.error("Ошибка при создании Excel файла:", error);
    res.status(500).json({
      message: "Ошибка создания Excel файла",
    });
  }
});

app.get("/excel-direction-members/:id", async (req, res) => {
  try {
    const filePath = await createExcelDirectionMembersOnly(req.params.id);

    res.download(filePath, "participants.xlsx", (err) => {
      if (err) {
        console.error("Ошибка при отправке файла:", err);
        res.status(500).send("Ошибка при скачивании файла");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка скачивания файла",
    });
  }
});

/* ROUTES */
app.use("/user", userRoutes);
app.use("/directing", directingRoutes);
app.use("/event", eventRoutes);

/* START FUNCTION */
async function start() {
  try {
    await mongoose
      .connect(MONGO_URI)
      .then(() => console.log("Mongo db connection successfully"))
      .catch((err) => console.log(err));

    app.listen(PORT, (err) => {
      if (err) return console.log("Приложение аварийно завершилось: ", err);
      console.log(`Сервер успешно запущен! Порт: ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
