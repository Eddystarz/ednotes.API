import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
	school: {
		type: Schema.Types.ObjectId,
		ref: "School",
	},
	faculty: {
		type: Schema.Types.ObjectId,
		ref: "Faculty",
	},
	dept: {
		type: Schema.Types.ObjectId,
		ref: "Dept",
	},
	level: {
		type: Schema.Types.ObjectId,
		ref: "Level",
	},
	// to be used in solv n+1
	// courseTopics: [
	// 	{
	// 		type: Schema.Types.ObjectId,
	// 		ref: "CourseTopic",
	// 	},
	// ],
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	semester: {
		type: Number,
		enum: [1, 2],
	},
});

export default mongoose.model("Course", courseSchema);
