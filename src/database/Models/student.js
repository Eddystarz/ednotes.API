import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		state: {
			type: String,
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
		onTrial: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Student", studentSchema);
