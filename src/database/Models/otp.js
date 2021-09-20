import mongoose, { Schema } from "mongoose";
import createOneTitmeToken from "../../services/otp";
const expiredIn = "15m";

const otpSchema = new Schema({
	user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	email: { type: String, required: true },
	value: { type: String, default: createOneTitmeToken },
	type: {
		type: String,
		enum: ["verify_email"],
		required: true,
	},
	createdAt: { type: Date, default: Date.now, expires: expiredIn },

	// expireAt: {
	// 	type: Date,
	// 	default: () => Date.now() + expiredMins,
	// },
});

const modelClass = mongoose.model("Otp", otpSchema);
modelClass.syncIndexes();
// (async () => {
// 	console.log("from otp model");
// 	await modelClass.init();

// 	console.log("heree", await modelClass.listIndexes());
// })();

export default modelClass;
