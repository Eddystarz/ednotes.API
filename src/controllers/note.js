import url from "url";
import axios from "axios";
import LectureNote from "../database/Models/lecture_notes";
import Student from "../database/Models/student";

export const getAttachment = async (req, res) => {
	try {
		// use req params later to check sub

		const { userId } = req.app.locals.authenticated;
		// const param = req.params;

		const proxy_url = url.format({
			protocol: req.protocol,
			host: req.get("host"),
			pathname: req.originalUrl,
		});

		const student = await Student.findOne({ user: userId });

		const note = await LectureNote.findOne({
			noteAttachments: { $elemMatch: { proxy_url } },
		}).populate("course");

		// change to sub check later by using level
		const rightCourse =
			student?.school.toString() === note?.course.school.toString() &&
			student?.faculty.toString() === note?.course.faculty.toString() &&
			student?.dept.toString() === note?.course.dept.toString() &&
			student?.level.toString() === note?.course.level.toString();

		if (!student || !note || !rightCourse) {
			return res.status(401).send({
				message: "You are not authorized to access this resource !",
				value: false,
			});
		}

		const cloudAttachmentUrl = note.noteAttachments.find(
			(attachment) => attachment.proxy_url === proxy_url
		);

		const response = await axios.get(cloudAttachmentUrl.url, {
			responseType: "stream",
		});
		response.data.pipe(res);
	} catch (err) {
		console.log(err);
		// throw err;
	}
};
