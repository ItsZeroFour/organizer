import express from "express";

import checkAuth from "../utils/checkAuth.js";
import {
  addUserToApplications,
  addUserToMembers,
  addUserToUserApplications,
  createEvent,
  getAllEvents,
  getApplications,
  getEvent,
  getEventAdmins,
  getMembers,
  getStudents,
  getUserApplications,
  getUserApplicationsFull,
  getUserEvents,
  updateEvent,
} from "../controllers/EventControllers.js";

const router = express.Router();

router.post("/create", checkAuth, createEvent);
router.get("/getAll", getAllEvents);
router.get("/get/:id", getEvent);
router.patch("/update/:id", checkAuth, updateEvent);
router.get("/get-members/:id", getMembers);
router.get("/get-applications/:id", getApplications);
router.put("/add-to-applications", checkAuth, addUserToApplications);
router.get("/get-students/:id", getStudents);
router.get("/get-user-applications", checkAuth, getUserApplications);
router.get(
  "/get-user-applications-full/:id",
  checkAuth,
  getUserApplicationsFull
);
router.get("/get-user-events/:id", checkAuth, getUserEvents);
router.put("/add-to-members", checkAuth, addUserToMembers);
router.put(
  "/add-to-userapplications/:eventId",
  checkAuth,
  addUserToUserApplications
);
router.get("/get-admins/:id", checkAuth, getEventAdmins);

export default router;
