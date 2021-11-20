import Agenda from "agenda";

import config from "../helper/config";

// ============= CRON FUNCTIONS ===============//
import { deleteStory, endTrial, deletePendingTransactions } from "./jobs";
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
});

agenda.define("remove pending transactions", async (_job) => {
	await deletePendingTransactions();
});

(async () => {
	// IIFE to give access to async/await
	await agenda.start();
	await agenda.every("1 day", "remove pending transactions");
})();
export { agenda };
