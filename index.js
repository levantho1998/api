const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8000;

// Thay thế chuỗi kết nối sau bằng link MongoDB của bạn
const mongoURI = "mongodb+srv://admin:admin@atlascluster.lb7b90g.mongodb.net/";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  sex: String,
});

const Todo = mongoose.model("admin", todoSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Hello, MongoDB!");
});

app.get("/ThoLv", async (req, res) => {
  try {
    const lists = await Todo.find();
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching todos." });
  }
});

// Thêm một bản ghi mới vào cơ sở dữ liệu

app.post("/ThoLv", async (req, res) => {
  const { title, description, sex } = req.body;

  if (!title || !description || !sex) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const newTodo = new Todo({
      title,
      description,
      sex,
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the todo." });
  }
});

const newTodoData = {
  title: "Buy groceries",
  description: "Milk, eggs, bread, vegetables",
  sex: "men",
};

const newTodo = new Todo(newTodoData);

newTodo
  .save()
  .then((savedTodo) => {
    console.log("New todo saved:", savedTodo);
  })
  .catch((error) => {
    console.error("An error occurred while saving the todo:", error);
  });

// Sửa bản ghi
app.put("/ThoLv/:id", async (req, res) => {
  const todoId = req.params.id;
  const { title, description, sex } = req.body;

  if (!title || !description || !sex) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      {
        title,
        description,
        sex,
      },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found." });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the todo." });
  }
});

// Get detail
app.get("/ThoLv/:id", async (req, res) => {
  const todoId = req.params.id;

  try {
    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found." });
    }

    res.status(200).json(todo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the todo." });
  }
});

// Delete
app.delete("/ThoLv/:id", async (req, res) => {
  const todoId = req.params.id;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found." });
    }

    res.status(200).json({ message: "Todo deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the todo." });
  }
});

////
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
