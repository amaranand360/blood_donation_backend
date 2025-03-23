import express from "express";
import { signup,login,getUserById } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login",login);
router.get("/getuser/:userId",getUserById);

export default router;
