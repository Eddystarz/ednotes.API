import Agenda from "agenda";

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

  console.log(data.name);
  console.log(data.date);
});

export { agenda };
