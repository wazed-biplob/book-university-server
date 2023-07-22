const express = require("express");

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
const collegeData = require("./college.json");

app.get("/", (req, res) => {
  res.send("ok all ok");
});
app.get("/college", (req, res) => {
  res.send(collegeData);
});
app.listen(port, () => {
  console.log(`running at ${port}`);
});
