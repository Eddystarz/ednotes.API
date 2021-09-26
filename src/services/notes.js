import url from "url";
import axios from "axios";
import LectureNote from "../database/Models/lecture_notes";
import Student from "../database/Models/student";

export const getAttachment = async (req, res) => {
	try {
		// use req params later to check sub

		const { Id } = req.app.locals.authenticated;
		// const param = req.params;
		const proxy_url = url.format({
			protocol: req.protocol,
			host: req.get("host"),
			pathname: req.originalUrl,
		});
		const student = await Student.findOne({ user: Id });
		const note = await LectureNote.findOne({
			"noteAttachments.proxy_url": proxy_url,
		}).populate("course");

		// change to sub check later by using level
		const rightCourse =
			student?.dept === note?.course.dept &&
			student?.level === note?.course.level;
		if (!student || !rightCourse) {
			throw new Error("You are not authorized to access this resource !");
		}

		const cloudAttachmentUrl = note.noteAttachments.find(
			(attachment) => attachment.proxy_url === proxy_url
		);
		const data = await axios.get(cloudAttachmentUrl.url).data;
		res.send(data);
	} catch (err) {
		throw err;
	}
};
