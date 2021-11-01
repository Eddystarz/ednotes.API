import Agenda from "agenda";

import config from "../helper/config";

// ============= CRON FUNCTIONS ===============//
import { deleteStory, endTrial } from "./jobs";
const { MONGO_DB_URI } = config;

const agenda = new Agenda({
	db: {
		address: MONGO_DB_URI,
		collection: "AgendaJobs",
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},
});

agenda.start();

// ============ Job definitions ============//
agenda.define("delete stories", async (job) => {
	const {
		attrs: { data },
	} = job;

	await deleteStory(data.id);
});

agenda.define("end trial", async (job) => {
	const {
		attrs: { data },
	} = job;

	await endTrial(data.id);
	await job.remove();
});

export { agenda };
