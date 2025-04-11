import User from "../models/User.js";
import { uploadFileToS3 } from "../utils/s3Client.util.js";

export const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            age,
            bloodGroup,
            gender,
            phone,
            password,
            termsCondations,
            profilePicture,
            medicalReport,
            city,
            address,
            latitude,
            longitude,
            userType
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !userType || !city || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user
        const user = await User.create({
            name,
            email,
            age,
            bloodGroup,
            gender,
            phone,
            password,
            termsCondations,
            profilePicture,
            medicalReport,
            city,
            address,
            latitude,
            longitude,
            userType
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                city: user.city,
                address: user.address,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        //     expiresIn: "1h",
        // });

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find user by ID
        const user = await User.findById(userId).select("-password"); // Exclude password field

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User fetched successfully", user });

    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const uploadProfile = async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            ResponseStatusCode.BAD_REQUEST,
            null,
            "No file uploaded"
          )
        );
    }
  
    const localFilePath = req.file.path;
    const accessUrl = await uploadFileToS3(localFilePath, "userProfile");
  
    return res.json(
      new ApiResponse(
        ResponseStatusCode.SUCCESS,
        accessUrl,
        "Profile Pic Uploaded successfully"
      )
    );
  
  };