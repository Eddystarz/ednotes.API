import mongoose, { Schema } from "mongoose";

const deptSchema = new Schema(
	{
		school: {
			type: Schema.Types.ObjectId,
			ref: "School",
		},
		faculty: {
			type: Schema.Types.ObjectId,
			ref: "Faculty",
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		pay_per_semester: {
			type: Number,
			default: 1500,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Dept", deptSchema);
