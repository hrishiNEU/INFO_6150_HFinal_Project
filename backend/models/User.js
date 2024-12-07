import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "User", "CommunityAdmin", "BusinessOwner"],
      required: true,
    },
    profileImage: { type: String, default: "" },
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
