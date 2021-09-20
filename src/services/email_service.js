import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import config from "../helper/config";
const { MG_API_KEY, MG_DOMAIN } = config;

const mgAuth = {
	auth: {
		api_key: MG_API_KEY,
		domain: MG_DOMAIN,
	},
};

const emailTemplateSource = fs.readFileSync(
	path.join(__dirname, "../views/email_verification.hbs"),
	"utf8"
);

const smtpTransporter = nodemailer.createTransport(mg(mgAuth));
const template = handlebars.compile(emailTemplateSource);

export const htmlToSend = (firstName, code) => template({ firstName, code });

export const sendMail = async (email, subject, text, html) => {
	const mailOptions = {
		from: "support@ednotes.com", // TODO replace this with your own email
		to: email, // TODO: the receiver email has to be authorized for the free tier
		subject,
		text,
		html: html,
	};

	return await smtpTransporter.sendMail(mailOptions);
	// .then(() => {
	// 	console.log("Email sent");
	// })
	// .catch((err) => {
	// 	console.log("Email not sent", err);
	// });
};
