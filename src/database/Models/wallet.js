import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const walletSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			unique: true,
		},
		account_balance: {
			type: Number,
			default: 0,
			required: true,
		},
		currency: {
			type: String,
			default: "NGN",
		},
	},
	{ timestamps: true }
);

walletSchema.plugin(uniqueValidator);

export default mongoose.model("Wallet", walletSchema);
