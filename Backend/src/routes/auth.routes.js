import { Router } from "express";
import { register, login, logoutUser } from "../controller/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import {
  authenticate,
} from "../middleware/auth.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body {string} username - The username of the user
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 *
 */

authRouter.post("/register", registerValidator, register);

/**
 *
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */

authRouter.post("/login", loginValidator, login);

authRouter.post("/logout", authenticate, logoutUser);

export default authRouter;
