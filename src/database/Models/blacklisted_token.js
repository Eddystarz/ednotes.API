import mongoose, { Schema } from "mongoose";

const blacklistedTokenSchema = new Schema({
	user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	token: { type: String },
	expiredAt: { type: Date, expires: 0 },
});

const modelClass = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
modelClass.syncIndexes();

export default modelClass;
