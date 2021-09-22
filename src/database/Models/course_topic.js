import mongoose, { Schema } from "mongoose";

const courseTopicSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	course: {
		type: Schema.Types.ObjectId,
		ref: "Course",
	},
	// to be used when solving n + 1
	// lectureNotes: [
	// 	{
	// 		type: Schema.Types.ObjectId,
	// 		ref: "LectureNote",
	// 	},
	// ],
});

export default mongoose.model("CourseTopic", courseTopicSchema);
