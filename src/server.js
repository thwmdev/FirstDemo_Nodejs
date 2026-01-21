import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./config/database.js";
import { Task } from "./model/task.js";

const app = express();
app.use(cors());
app.use(express.json()); 

connectDB(process.env.MONGO_URI);

app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});


app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: "KHONG TIM THAY CONG VIEC" });
  }
});



app.patch("/api/tasks/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});



app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: "KHONG THAY ID" });
    }
    res.json({ message: "DA XOA" });
  } catch (error) {
    res.status(500).json({ error: "LOI HE THONG" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`Chay tai http://localhost:${PORT}`));