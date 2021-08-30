import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import config from "../utils/config";
const { API_KEY } = config;

const auth = {
	auth: {
		api_key: API_KEY || "SENDGRID_API_KEY", // TODO: Replace with your mailgun API KEY
		// domain: process.env.DOMAIN || 'SENDGRID_DOMAIN' // TODO: Replace with your mailgun DOMAIN
	},
};

const transporter = nodemailer.createTransport(nodemailerSendgrid(auth));

export const sendMail = (email, subject, text, html) => {
	const mailOptions = {
		from: "YOUR_EMAIL_HERE@gmail.com", // TODO replace this with your own email
		to: email, // TODO: the receiver email has to be authorized for the free tier
		subject,
		text,
		html: html,
	};

	transporter
		.sendMail(mailOptions)
		.then(() => {
			console.log("Email sent");
		})
		.catch(() => {
			console.log("Email not sent");
		});
};
