import url from "url";
import axios from "axios";
import LectureNote from "../database/Models/lecture_notes";
import Student from "../database/Models/student";

export const getAttachment = async (req, res) => {
	try {
		// use req params later to check sub
		console.log("enter get");
		const { userId } = req.app.locals.authenticated;
		// const param = req.params;
		console.log("the pprotocol", req.protocol);
		const proxy_url = url.format({
			protocol: req.protocol,
			host: req.get("host"),
			pathname: req.originalUrl,
		});
		console.log(proxy_url);
		const student = await Student.findOne({ user: userId });
		console.log("student", student);
		const note = await LectureNote.findOne({
			noteAttachments: { $elemMatch: { proxy_url } },
		}).populate("course");

		console.log("note", note);

		// change to sub check later by using level
		const rightCourse =
			student?.school.toString() === note?.course.school.toString() &&
			student?.faculty.toString() === note?.course.faculty.toString() &&
			student?.dept.toString() === note?.course.dept.toString() &&
			student?.level.toString() === note?.course.level.toString();
		console.log(
			"right",
			!rightCourse,
			!note,
			!student,
			student?.school.toString(),
			note?.course.school.toString(),
			student?.school.toString() === note?.course.school.toString(),
			typeof student?.school.toString(),
			typeof note?.course.school.toString()
		);
		if (!student || !note || !rightCourse) {
			console.log("return");
			return res.status(401).send({
				message: "You are not authorized to access this resource !",
				value: false,
			});
		}

		const cloudAttachmentUrl = note.noteAttachments.find(
			(attachment) => attachment.proxy_url === proxy_url
		);
		console.log("cau", cloudAttachmentUrl, cloudAttachmentUrl.url);
		const data = await axios.get(cloudAttachmentUrl.url);
		console.log("data", typeof data);
		res.send(data);
	} catch (err) {
		console.log(err);
		// throw err;
	}
};
