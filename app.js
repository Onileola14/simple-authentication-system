require("dotenv").config();
require('async-express-error')
const authRouter = require("./routes/authRoute");
const connectDB = require("./db/connectDB");
const express = require("express");
const app = express();
app.use(express.json());



app.get("/", (req, res) => {
  res.send("simple authentication system");
});






app.use("/api/v2/auth", authRouter);





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
