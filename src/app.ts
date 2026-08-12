
import dotenv from "dotenv";
dotenv.config();
import "express-async-error";

// Third-party packages
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";


// Local modules
import connectDB from "./db/connectDB";
import errorHandlerMiddleware from "./middlewares/error-handler";
import notFound from "./middlewares/notFound";
import authRouter from "./auth/auth.route";
import userRouter from "./user/user.route";


const app = express();
app.set("trust proxy", 1);
// Global middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());
app.use(cors());

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
