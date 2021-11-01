import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { isAuthenticated } from "./helper/rest_middleware";
import { getAttachment } from "./controllers/note";
import { getPaystackEvent } from "./controllers/webhook";

import graphQlServer from "./server";

config();

const PORT = process.env.PORT || 7000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// create a routes folder later - refferal

// proxy endpoint to fetch notes for protection
app.get("/notes/:note/:att", isAuthenticated, getAttachment);
app.get("/wh/paystack", isAuthenticated, getPaystackEvent);

graphQlServer(app, PORT).catch((err) => console.log(err));

export default app;
