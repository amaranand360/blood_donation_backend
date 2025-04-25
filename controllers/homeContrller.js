import User from "../models/User.js";
import BloodRequest from "../models/BloodRequest.js";
import Donor from "../models/Donor.js";

export const getDonors = async (req, res) => {
  try {
    const { bloodGroup, distance, lat, lng } = req.body;

    let query = { userType: "Donor" };

    if (bloodGroup !== "All") {
      query.bloodGroup = bloodGroup || "A+";
    }
    console.log(query);

    // Fetch all donors based on bloodGroup filter first
    let donors = await User.find(query)
      .select("-password -createdAt -updatedAt -__v");

      console.log(donors);


    // Filter by distance using Haversine formula if lat/lng provided
    if (distance && lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const maxDistance = parseFloat(distance); // in KM

      donors = donors.filter(donor => {
        if (donor.latitude && donor.longitude) {
          const dLat = deg2rad(donor.latitude - userLat);
          const dLng = deg2rad(donor.longitude - userLng);
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(userLat)) * Math.cos(deg2rad(donor.latitude)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distanceInKm = 6371 * c; 
          console.log("Distance in KM:", distanceInKm);
          console.log("Max Distance:", maxDistance);
          console.log("No coordinates found for donor:", distanceInKm <= maxDistance);  
          return distanceInKm <= maxDistance;
        }
        return false;
      });
    }

    console.log(donors);

    // Limit to top 10 results
    donors = donors.slice(0, 10);
    console.log(donors);

    res.status(200).json({ message: "Donors fetched successfully", donors });
  } catch (error) {
    console.error("Get Donors Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Utility function
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}



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

