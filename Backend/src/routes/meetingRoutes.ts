import express from "express";
import {
  createMeeting,
  getMeetings,
  acceptMeeting,
  rejectMeeting,
} from "../controllers/meetingController";

const router = express.Router();

// Create Meeting
router.post("/", createMeeting);

// Get All Meetings
router.get("/", getMeetings);

// Accept Meeting
router.put("/:id/accept", acceptMeeting);

// Reject Meeting
router.put("/:id/reject", rejectMeeting);

export default router;