import mongoose, { Schema } from "mongoose";

const trialCourseSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	student: {
		type: Schema.Types.ObjectId,
		ref: "Student",
		required: true,
	},
	school: {
		type: Schema.Types.ObjectId,
		ref: "School",
		required: true,
	},
	faculty: {
		type: Schema.Types.ObjectId,
		ref: "Faculty",
		required: true,
	},
	dept: {
		type: Schema.Types.ObjectId,
		ref: "Dept",
		required: true,
	},
	level: {
		type: Schema.Types.ObjectId,
		ref: "Level",
		required: true,
	},
	semester: {
		type: Number,
		enum: [1, 2],
		required: true,
	},
	createdAt: { type: Date, default: Date.now, expires: "8d" },
});
trialCourseSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		// returnedObject.id = returnedObject._id.toString()
		delete returnedObject.user;
		delete returnedObject.student;
	},
});
export default mongoose.model("TrialCourse", trialCourseSchema);
