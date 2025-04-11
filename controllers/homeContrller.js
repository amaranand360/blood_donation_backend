import User from "../models/User.js";
import BloodRequest from "../models/BloodRequest.js";

export const getDonors = async (req, res) => {
    try {
        const donors = await User.find({ userType: "Donor" })
        .select("-password -createdAt -updatedAt -__v")
        .limit(10);

        res.status(200).json({ message: "Donors fetched successfully", donors });
    } catch (error) {
        console.error("Get Donors Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const createBloodRequest = async (req, res) => {
  try {
    const {
      patient_name,
      phone,
      unit,
      date,
      time,
      blood_group,
      location,
      note
    } = req.body;

    // Optional: associate user if using auth middleware
    const requestedBy = req.user?.id || "67f9499896f0bc1360774ff3";

    const newRequest = new BloodRequest({
      patient_name,
      phone,
      unit,
      date,
      time,
      blood_group,
      location,
      note,
      requestedBy
    });

    await newRequest.save();

    res.status(201).json({ message: "Blood request created successfully", request: newRequest });
  } catch (error) {
    console.error("Create Blood Request Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
