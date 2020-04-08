const express = require("express");
const app = express();

// setup
app.set("view engine", "ejs");
app.use(express.static("public"));

// routes
app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  const campgrounds = [
    { name: "Campsite1", img: "image file url" },
    { name: "Campsite2", img: "image file url" },
    { name: "Campsite3", img: "image file url" },
    { name: "Campsite4", img: "image file url" },
    { name: "Campsite5", img: "image file url" },
    { name: "Campsite6", img: "image file url" },
  ];
  res.render("campgrounds", { campgrounds });
});

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`YelpCamp server started on port ${port}...`)
);
