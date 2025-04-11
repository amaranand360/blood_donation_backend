import mongoose from "mongoose";

const BloodRequestSchema = new mongoose.Schema({
  patient_name: { type: String, required: true },
  phone: { type: String, required: true },
  unit: { type: String, required: true }, // can be changed to Number if units are numeric
  date: { type: String, required: true }, // you can use Date if needed
  time: { type: String, required: true },
  blood_group: { type: String, required: true },
  location: { type: String, required: true },
  note: { type: String },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // optional
}, { timestamps: true });

export default mongoose.model("BloodRequest", BloodRequestSchema);
