import mongoose, { Schema } from "mongoose";

const courseTopicSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course"
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

export default mongoose.model("CourseTopic", courseTopicSchema);
