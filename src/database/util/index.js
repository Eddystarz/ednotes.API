const mongoose = require("mongoose");

export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Message if Successfully Connected to DB
    mongoose.connection.on("connected", () => {
      console.log(`Connected to database ${process.env.MONGO_DB_URL}`);
    });

    // Message if There is an error in database Connection
    mongoose.connection.on("error", (err) => {
      throw err;
    });

    // To Remove moongoose depreciation warnings
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
