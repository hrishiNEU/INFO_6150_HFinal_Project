import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["CheckedIn", "Pending"],
      default: "CheckedIn",
      required: true,
    },
    location: { type: String, required: true },
    resource: { type: String, required: true },
    address: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
