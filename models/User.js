import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
    },
    email: {
      type: String,
      required:true,
      unique: true,
    },
    age:{
      type: Number,
      required: false,
    },
    bloodGroup:{
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },
    phone:{
      type: Number,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    termsCondations: {
      type: Boolean,
      required: false,
    },
    profilePicture: {
      type: String,
      default: "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369991.png",
      required: false,
    },
    medicalReport: {
      type: String,
      required: false,
    },
    userType: {
      type: String,
      enum: ["Donor", "Hospital", "Patient", "Organization", "Other"],
      required: true,
    },
    city:{
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    latitude:{
      type: Number,
      required: false,
    },
    longitude:{
      type: Number,
      required: false,
    },
    status: {
      type: String,
      default: 'active',
      required: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
