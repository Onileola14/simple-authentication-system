require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());



app.get("/", (req, res) => {
  res.send("simple authentication system");
});












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
