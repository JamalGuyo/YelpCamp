const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const campgrounds = [
  {
    name: "Mountain Goat's rest",
    img:
      "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Salmon Creek",
    img:
      "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Granite Hill",
    img:
      "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
];

// routes
app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.post("/campgrounds", (req, res) => {
  const name = req.body.name;
  const img = req.body.image;
  campgrounds.push({
    name,
    img,
  });
  res.redirect("/campgrounds");
});

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`YelpCamp server started on port ${port}...`)
);
