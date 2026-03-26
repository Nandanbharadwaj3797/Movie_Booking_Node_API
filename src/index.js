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
const showRoutes = require('./routes/show.routes');
const paymentRoutes = require('./routes/payment.routes');

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const mongoUri = isProduction ? process.env.PROD_DB_URL : process.env.DB_URL;
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());



app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

mongoose.set('debug', !isProduction);



MovieRoutes(app);
theatreRoutes(app);
authRoutes(app);
userRoutes(app);
bookingRoutes(app);
showRoutes(app);
paymentRoutes(app);

app.use(errorHandler);

const startServer = async () => {
  try {
    if (!mongoUri) {
      throw new Error('MongoDB URI is missing. Set DB_URL for development or PROD_DB_URL for production.');
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");

    app.listen(port, () => {
      console.log(`Server started on Port ${port}`);
    });

  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }
};

startServer();
