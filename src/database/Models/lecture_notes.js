import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

import { dateUtc } from "../../helper/date_helpers";

const lectureNoteSchema = new mongoose.Schema({
	course: {
		type: Schema.Types.ObjectId,
		ref: "Course",
	},
	courseTopic: {
		type: Schema.Types.ObjectId,
		ref: "CourseTopic",
	},
	name: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	// Class attachment...Video or Pdfs
	noteAttachments: [
		{
			// Url returned from cloud storage
			url: {
				type: String,
			},
			file_name: {
				type: String,
			},
			proxy_url: {
				type: String,
				unique: true,
			},
			// If file is pdf or audio
			mime_type: {
				type: String,
				enum: ["pdf", "video"],
			},
			// Date file was uploaded..Can be used for sorting or timestamps. The date is
			// stored as UTC...
			date_uploaded: {
				type: Date,
				default: dateUtc,
			},
		},
	],
});
lectureNoteSchema.plugin(uniqueValidator);
lectureNoteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		// returnedObject.id = returnedObject._id.toString()
		delete returnedObject.url;
		delete returnedObject.file_name;
	},
});

export default mongoose.model("LectureNote", lectureNoteSchema);
