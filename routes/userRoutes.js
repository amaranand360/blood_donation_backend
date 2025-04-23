import express from "express";
import {uploadProfile} from "../controllers/authController.js";
import { getDonors,createBloodRequest , createDonor } from "../controllers/homeContrller.js";
import { uploadFile } from "../utils/s3Client.util.js";

const router = express.Router();


router.post('/uploadProfile', uploadFile.single('profilePicture'), uploadProfile);
router.get('/default-donors',  getDonors);
router.post('/blood-requests',  createBloodRequest);
router.post('/donation-requests', createDonor);


export default router;
