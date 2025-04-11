import express from "express";
import {uploadProfile} from "../controllers/authController.js";
import { getDonors } from "../controllers/homeContrller.js";
import { uploadFile } from "../utils/s3Client.util.js";

const router = express.Router();


router.post('/uploadProfile', uploadFile.single('profilePicture'), uploadProfile);
router.get('/default-donors',  getDonors);


export default router;
