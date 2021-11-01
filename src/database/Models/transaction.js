import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		wallet: {
			type: Schema.Types.ObjectId,
			ref: "Wallet",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			enum: ["credit", "debit"],
			required: true,
		},
		status: {
			type: String,
			enum: ["success", "pending", "failed"],
			default: "pending",
			required: true,
		},
		balance_after_transaction: {
			type: Number,
			required: true,
		},
		description: {
			type: "string",
			required: true,
		},
	},
	{ timestamps: { createdAt: "date" } }
);

transactionSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		// returnedObject.id = returnedObject._id.toString()
		delete returnedObject.user;
		delete returnedObject.wallet;
	},
});

export default mongoose.model("Transaction", transactionSchema);
