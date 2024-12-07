import express from "express";
import {
  createEvent,
  getAllEvents,
  signupForEvent,
  getEventsByOwner,
  getEventByEventId,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/create").post(protect, createEvent); //create
router.route("/getAll").get(protect, getAllEvents);
router.route("/api/:eventId").get(protect, getEventByEventId);
router.route("/:eventId/signup").post(protect, signupForEvent);
router.route("/owner").get(protect, getEventsByOwner);
router.route("/:eventId").delete(protect, deleteEvent);
router.route("/:eventId").put(protect, updateEvent);

export default router;