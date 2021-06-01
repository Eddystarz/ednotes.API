import mongoose, { Schema } from "mongoose";

const schoolSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);
