import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";
import config from "../../helper/config";
const { JWT_SECRET_KEY } = config;

const convertAndHash = (account_balance) => {
	const converted = account_balance * 100;
	account_balance = converted.toFixed(2);
	const hash = jwt.sign({ account_balance }, JWT_SECRET_KEY);
	return hash;
};

const decodeAndConvert = (encodedBalance) => {
	let amount = 0;
	jwt.verify(encodedBalance, JWT_SECRET_KEY, (err, decoded) => {
		if (!err) {
			amount = Number(decoded.account_balance);
		}
	});
	amount /= 100;
	return amount.toFixed(2);
};

const walletSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			unique: true,
		},
		account_balance: {
			type: String,
			default: "0.00",
			set: convertAndHash,
			get: decodeAndConvert,
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

// walletSchema.set("toJSON", {
// 	transform: (document, returnedObject) => {
// 		// returnedObject.id = returnedObject._id.toString()
// 		returnedObject.account_balance = parseFloat(returnedObject.account_balance);
// 	},
// });

export default mongoose.model("Wallet", walletSchema);
