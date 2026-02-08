const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const MovieRoutes = require('./routes/movie.routes');
const theatreRoutes = require('./routes/theatre.routes');

// load environment variables
dotenv.config();

const app = express();

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.set('debug', true);

MovieRoutes(app); // invoking movie routes
theatreRoutes(app); // involing theatre routes


// start server + connect DB
app.listen(process.env.PORT, async () => {
  console.log(`Server started on Port ${process.env.PORT} !!`);

  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Not able to connect MongoDB", err);
    process.exit(1);
  }
});
