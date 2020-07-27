//Dependencies
const http = require("http");
const path = require("path");
const PORT = process.env.PORT || 3000
const express = require("express");
let fs = require("fs");
let db = require("./db/db.json");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static content for the app from the public directory
app.use(express.static("public"));

//to return the notes.html
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.json(db);
});

//write to db.json file
app.post("/api/notes", async (req, res) => {
  let newNote = { title: req.body.title, text: req.body.text, id: db.length+1 };
  db.push(newNote);
  console.log(db);
  fs.writeFile("./db/db.json", JSON.stringify(db), function (error) {
    if (error) {
      return console.log(error);
    }

    console.log("success");
    res.json(db);
  });
});

//To delete from db.json file
app.delete("/api/notes/:id", async (req, res) => {
  const deleteId = req.params.id;
  console.log(deleteId);
  try {
    if (deleteId) {
      db = db.filter(function (val) {
        return val.id != deleteId;
      });
    }
    return res.json(db);
  } catch {
    res.status(500).json(err);
  }
});

//to return the index.html
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.listen(PORT, () =>
  console.log(`App is listening on: http://localhost:${PORT}`)
);