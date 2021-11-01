import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema({
	point_per_second: {
		type: Schema.Types.Number,
		default: 0.02,
	},
	// test_challenges: {
	// 	type: Schema.Types.Number,
	// 	default: 0,
	// },
	refferal: {
		type: Schema.Types.Number,
		default: 200,
	},
});

export default mongoose.model("Settings", settingsSchema);
