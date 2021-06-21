import Agenda from "agenda";

// ============= CRON FUNCTIONS ===============//
import { deleteStory } from "./jobs";

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_DB_URL,
    collection: "AgendaJobs",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
});

agenda.start();

// ============ Job definitions ============//
agenda.define("delete stories", async (job) => {
  const {
    attrs: { data }
  } = job;

  await deleteStory(data.id);
});

export { agenda };
