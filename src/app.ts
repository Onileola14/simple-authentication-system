import dotenv from "dotenv";
dotenv.config();
import "async-express-error";

// Third-party packages
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import path from "path";


// Local modules
import {connectDB} from "./db/connectDB";
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

// Static front end — built from client/ into ./public (see `npm run build:client`).
// Serving same-origin means the httpOnly JWT cookie flows without CORS.
const publicDir = path.join(process.cwd(), "public");
app.use(express.static(publicDir));

// API routes
app.use("/api/v2/auth", authRouter);
app.use("/api/v2/user", userRouter);

// SPA fallback: serve the UI for any non-API GET that didn't match a static file.
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(publicDir, "index.html"), (err) => {
      if (err) next();
    });
  }
  next();
});

// Error handling
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}

const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
