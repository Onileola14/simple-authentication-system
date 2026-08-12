"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
require("async-express-error");
// Third-party packages
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
// Local modules
const connectDB = require("./db/connectDB");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFound = require("./middlewares/notFound");
const authRouter = require("./auth/auth.route");
const userRouter = require("./user/user.route");
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
    }
    catch (error) {
        console.error(error);
    }
};
start();
