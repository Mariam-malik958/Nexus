import { Request, Response } from "express";
import Meeting from "../models/Meeting";

export const createMeeting = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      investorId,
      entrepreneurId,
      startTime,
      endTime,
    } = req.body;

    // Conflict Detection – double booking check
    const conflict = await Meeting.findOne({
      status: { $in: ["pending", "accepted"] },
      $or: [
        { investorId },
        { entrepreneurId },
      ],
      startTime: { $lt: new Date(endTime) },
      endTime:   { $gt: new Date(startTime) },
    });

    if (conflict) {
      return res.status(409).json({
        message: "Time slot already booked! Please choose a different time.",
      });
    }

    const meeting = await Meeting.create({
      title,
      investorId,
      entrepreneurId,
      startTime,
      endTime,
    });

    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({
      message: "Meeting creation failed",
    });
  }
};

export const getMeetings = async (
  req: Request,
  res: Response
) => {
  try {
    const meetings = await Meeting.find()
      .populate("investorId", "name email")
      .populate("entrepreneurId", "name email");

    res.json(meetings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch meetings",
    });
  }
};

export const acceptMeeting = async (
  req: Request,
  res: Response
) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({
      message: "Failed to accept meeting",
    });
  }
};

export const rejectMeeting = async (
  req: Request,
  res: Response
) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject meeting",
    });
  }
};