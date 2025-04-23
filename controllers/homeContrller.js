import User from "../models/User.js";
import BloodRequest from "../models/BloodRequest.js";
import Donor from "../models/Donor.js";
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
    const requestedBy = req.query.userId || "67e99111eb32dbea224507ab"; // fetch from query

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


export const createDonor = async (req, res) => {
  try {
    const { name, location, phone, bloodType, donationDate, donationTime, note } = req.body;

    if (!name || !location || !phone || !bloodType || !donationDate || !donationTime) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const newDonor = new Donor({
      name,
      location,
      phone,
      bloodType,
      donationDate,
      donationTime,
      note
    });

    const savedDonor = await newDonor.save();
    res.status(201).json({ message: "Donor created successfully", donor: savedDonor });
  } catch (error) {
    console.error("Error creating donor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

