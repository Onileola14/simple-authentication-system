require("dotenv").config();
require('async-express-error')
const express = require("express");
const app = express();
app.use(express.json());
const authRouter = require("./routes/authRoute");



app.get("/", (req, res) => {
  res.send("simple authentication system");
});






app.use("/api/v2/auth", authRouter);





const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
