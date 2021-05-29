import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    phoneNumber: {
      type: String
    },
    state: {
      type: String
    },
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
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
