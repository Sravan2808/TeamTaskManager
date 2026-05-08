import { Router } from "express";
import User from "../models/user.model.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.put("/:userId/role",requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role: req.body.role },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
