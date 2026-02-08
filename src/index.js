const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const MovieRoutes = require('./routes/movie.routes');

// load environment variables
dotenv.config();

const app = express();

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MovieRoutes(app); // invoking movie routes

// basic test route
app.get("/home", (req, res) => {
  console.log("Hitting /home");
  return res.status(200).json({
    success: true,
    message: "Fetched home"
  });
});

// env variables
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

// validation
if (!DB_URL) {
  console.error("DB_URL not defined in .env file");
  process.exit(1);
}

// start server + connect DB
app.listen(PORT, async () => {
  console.log(`Server started on Port ${PORT} !!`);

  try {
    await mongoose.connect(DB_URL);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Not able to connect MongoDB", err);
    process.exit(1);
  }
});
