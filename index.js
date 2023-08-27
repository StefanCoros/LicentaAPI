const express = require("express");
const app = express();

const router = require("./src/router/index");

app.use("/api", router);

app.use("/", (req, res) => {
  res.redirect("/api");
});

const port = 3001;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
