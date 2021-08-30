import cloudinary from "cloudinary";
import config from "../utils/config";
const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = config;

cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

// File upload to cloudinary
export const processUpload = async (file) => {
	const { filename, createReadStream } = await file;

	try {
		const result = await new Promise((resolve, reject) => {
			console.log("Promise called");
			createReadStream().pipe(
				cloudinary.v2.uploader.upload_stream((error, result) => {
					if (error) {
						reject(error);
					}

					resolve(result);
				})
			);
		});

		const newPhoto = { filename, path: result.secure_url };

		return newPhoto;
	} catch (err) {
		throw err;
	}
};
