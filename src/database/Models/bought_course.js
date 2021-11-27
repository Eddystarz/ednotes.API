import mongoose, { Schema } from "mongoose";

const boughtCourseSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		student: {
			type: Schema.Types.ObjectId,
			ref: "Student",
		},
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
		semester: {
			type: Number,
			enum: [1, 2],
		},
	},
	{
		timestamps: true,
	}
);
boughtCourseSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		// returnedObject.id = returnedObject._id.toString()
		delete returnedObject.user;
		delete returnedObject.student;
	},
});
export default mongoose.model("BoughtCourse", boughtCourseSchema);
