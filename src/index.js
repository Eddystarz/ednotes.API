import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { isAuthenticated } from "./helper/rest_middleware";
import { getAttachment } from "./services/notes";

import graphQlServer from "./server";

config();

const PORT = process.env.PORT || 7000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// create a routes folder later
app.get("/notes/:note/:att", isAuthenticated, getAttachment);

graphQlServer(app, PORT).catch((err) => console.log(err));

export default app;
