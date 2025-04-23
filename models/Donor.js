import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  bloodType: { type: String, required: true },
  donationDate: { type: String, required: true }, // or Date if you'd like to store actual date
  donationTime: { type: String, required: true },
  note: { type: String },
}, {
  timestamps: true // optional: adds createdAt & updatedAt
});

export default mongoose.model("DonationReq", donorSchema);
