import { config } from "dotenv";

config();
// destructure to make any new dev be able to picture all the env var used all at once
const {
	EMAIL_SECRET,
	JWT_SECRET_KEY,
	NODE_ENV,
	MONGO_DB_URI,
	CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	API_KEY,
} = process.env;
// console.log("test mongooooooo", MONGO_DB_URI);

export default {
	EMAIL_SECRET,
	JWT_SECRET_KEY,
	NODE_ENV,
	MONGO_DB_URI,
	CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	API_KEY,
};
