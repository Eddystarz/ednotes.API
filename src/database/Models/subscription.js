import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
	{
		student: {
			type: Schema.Types.ObjectId,
			ref: "Student",
		},
		course: {
			type: Schema.Types.ObjectId,
			ref: "Course",
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
	},
	{ timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
