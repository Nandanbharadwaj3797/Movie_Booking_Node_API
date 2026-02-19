const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const MovieRoutes = require('./routes/movie.routes');
const theatreRoutes = require('./routes/theatre.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/errorHandler.middlewares');
const bookingRoutes = require('./routes/booking.routes');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(errorHandler);

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

mongoose.set('debug', true);

MovieRoutes(app);
theatreRoutes(app);
authRoutes(app);
userRoutes(app);
bookingRoutes(app);


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
