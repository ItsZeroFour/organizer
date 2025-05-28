import dotenv from "dotenv";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const SECRET = process.env.SECRET;

/**
 * @description Регистрация нового пользователя
 * @param {Object} req - Объект запроса
 * @param {Object} res - Объект ответа
 * @access private
 * @method post
 */
export const registerUser = async (req, res) => {
  try {
    const userEmail = await UserModel.findOne({ email: req.body.email });

    if (userEmail) {
      return res.status(400).json({
        message: "Пользователь уже существует с такой почтой",
      });
    }

    const password = req.body.password;

    if (password.length < 8) {
      return res.status(401).json({
        message: "Пароль должен быть не менее 8 символов",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email.toLowerCase(),
      password: hashPassword,
    });

    const user = await doc.save();

    const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: "30d" });

    const userData = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Не удалось зарегестрироваться",
    });
  }
};

/**
 * @description Обновление пользователя
 * @param {Object} req - Объект запроса
 * @param {Object} res - Объект ответа
 * @access private
 * @method patch
 */
export const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        message: "Пользователя не существует",
      });
    }

    const { fullName, email, password, group, phone, birthdate, post } =
      req.body;

    const updatedData = {
      fullName: fullName || user.fullName,
      email: email || user.email,
      password: password || user.password,
      group: group || user.group,
      phone: phone || user.phone,
      birthdate: birthdate || user.birthdate,
      post: post || user.post,
    };

    await UserModel.findByIdAndUpdate(req.userId, updatedData);

    return res.status(200).json({
      message: "Успешно!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось обновить пользователя",
    });
  }
};

/**
 * @description Вход пользователя в систему
 * @param {Object} req - Объект запроса
 * @param {Object} res - Объект ответа
 * @access private
 * @method post
 */
export const loginUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Неправильный логин или пароль",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.password
    );

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: "30d" });

    const { password, ...userData } = user._doc;

    res.status(200).json({ ...userData, token });
  } catch (error) {
    res.status(400).json({
      message: "Ошибка входа",
    });
  }
};

/**
 * @description Получение данных пользователя
 * @param {Object} req - Объект запроса
 * @param {Object} res - Объект ответа
 * @access public
 * @method get
 */
export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).send({
        message: "Пользователь не найден",
      });
    }

    const { password, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Не удалось получить пользователя",
    });
  }
};

export const getUserData = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить данные пользователя",
    });
  }
};
