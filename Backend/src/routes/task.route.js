import { Router } from "express";
import Task from "../models/task.model.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assigneeId", "username email")
      .populate("projectId", "name color");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.put("/:taskId", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete("/:taskId", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);

    res.json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
