import jwt from "jsonwebtoken";
import config from "./config";
const { JWT_SECRET_KEY } = config;

const getTokenFrom = (request) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.toLowerCase().startsWith("Bearer "))
		return authorization.substring(7);
	return null;
};

export const isAuthenticated = async (req, res, next) => {
	const token = getTokenFrom(req);
	const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
	if (!token || !decodedToken.userId)
		return res.status(401).json({
			message: "Unauthorized user !",
			value: false,
		});
	// console.log("the decoded token", decodedToken);
	req.app.locals.authenticated = decodedToken;
	next();
};
