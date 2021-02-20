const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { static } = require('express');

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

let items = [
  {item: "<- To check or uncheck item", isDone: true},
  {item: "Delete item from list ->", isDone: false},
  {item: "Drag and drop to reorder.", isDone: false},
  {item: "Add new list item below.", isDone: false},
];

app.route("/")
.get((req, res) => {
  res.render("list", {listTitle: "EJS To Do", newListItems: items});
})
.post((req, res) => {
  if (req.body.type === "reorder") {
    const oldIndex = req.body.oldIndex;
    const newIndex = req.body.newIndex;
    const item = items[oldIndex];
    items.splice(oldIndex, 1);
    items.splice(newIndex, 0, item);
  } else if (req.body.type === "delete") {
    items.splice(req.body.index, 1);
  } else {
    const item = {item:req.body.newItem, status:false};
  items.push(item);
  }
  res.redirect("/");
})
.put((req, res) => {
  if (req.body.type === "reorder") {
    const oldIndex = req.body.oldIndex;
    const newIndex = req.body.newIndex;
    const item = items[oldIndex];
    items.splice(oldIndex, 1);
    items.splice(newIndex, 0, item);
  } else if (req.body.type === "checked") {
    items[req.body.index].isDone = req.body.isDone;
    res.send("Updated");
  }
})
.delete((req, res) => {
  items.splice(req.body.index, 1);
  res.send("Deleted");
});


app.listen((port = 8000), () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
