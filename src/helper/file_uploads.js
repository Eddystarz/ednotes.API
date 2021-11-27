import cloudinary from "cloudinary";
import config from "./config";
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
			createReadStream().pipe(
				cloudinary.v2.uploader.upload_stream(
					{ resource_type: "auto", type: "authenticated", sign_url: true },
					(error, result) => {
						if (error) {
							reject(error);
						}

						resolve(result);
					}
				)
			);
		});

		const newContent = { filename, path: result.secure_url };

		return newContent;
	} catch (err) {
		throw err;
	}
};
