require("dotenv").config();
require("async-express-error");

// Third-party packages
const express = require("express");
const cookieParser = require("cookie-parser");

// Local modules
const connectDB = require("./db/connectDB");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFound = require("./middlewares/notFound");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");

const app = express();

// Global middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Routes
app.get("/", (req, res) => {
  res.send("simple authentication system");
});

app.use("/api/v2/auth", authRouter);
app.use("/api/v2/user", userRouter);

// Error handling
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();