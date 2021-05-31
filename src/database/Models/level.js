import mongoose, { Schema } from "mongoose";

const levelSchema = new Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School"
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty"
    },
    dept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dept"
    },
    name: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Level", levelSchema);
