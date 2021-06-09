import Agenda from "agenda";

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_DB_URL,
    collection: "AgendaJobs",
    options: { useNewUrlParser: true, useUnifiedTopology: true }
  }
});

agenda.start();

export { agenda };
