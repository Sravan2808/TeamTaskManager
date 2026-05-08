import { Router } from "express";
import Project from "../models/project.model.js";
import ProjectMember from "../models/projectmember.model.js";
import Task from "../models/task.model.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find();
    } else {
      const memberships = await ProjectMember.find({
        userId: req.user._id,
      });

      const ids = memberships.map((m) => m.projectId);

      projects = await Project.find({
        _id: { $in: ids },
      });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user._id,
    });

    await ProjectMember.create({
      projectId: project._id,
      userId: req.user._id,
      role: "admin",
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete("/:projectId", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.projectId);

    await Task.deleteMany({
      projectId: req.params.projectId,
    });

    await ProjectMember.deleteMany({
      projectId: req.params.projectId,
    });

    res.json({
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
