import mongoose, { Schema } from "mongoose";

const deptSchema = new Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School"
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty"
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Dept", deptSchema);
