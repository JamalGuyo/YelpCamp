const express = require("express");
const app = express();

// setup
app.set("view engine", "ejs");
app.use(express.static("public"));

// routes
app.get("/", (req, res) => {
  res.render("landing");
});

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`YelpCamp server started on port ${port}...`)
);
