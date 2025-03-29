import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Task from "./models/Task.js"; // Import Task model

dotenv.config(); // Load .env variables

const app = express();

// Configure CORS with more permissive options
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use(express.json());

// Add root route handler
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CollabTask API' });
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 Connected to MongoDB");
    // Test saving a task
    const testTask = new Task({ title: "Test Task", description: "This is a test task." });
    testTask.save().then(() => console.log("Test task saved!")).catch(err => console.error("Error saving test task:", err));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// 🟢 API ROUTES

// ➤ Get all tasks with sorting and filtering
app.get("/tasks", async (req, res) => {
  try {
    const { 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      subject,
      status,
      priority,
      search
    } = req.query;

    let query = {};

    // Apply filters
    if (subject) query.subject = subject;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(query).sort(sortOptions);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Add a new task
app.post("/tasks", async (req, res) => {
  console.log('Received task creation request:', req.body);
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      category: req.body.category || 'general',
      subject: req.body.subject || 'general',
      status: req.body.status || 'To Do'
    });

    console.log('Attempting to save task:', task);
    const newTask = await task.save();
    console.log('Task saved successfully:', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(400).json({ message: error.message });
  }
});

// ➤ Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        category: req.body.category,
        subject: req.body.subject,
        status: req.body.status
      },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Update task status (for drag and drop)
app.patch("/tasks/:id/status", async (req, res) => {
  try {
    const { status, order } = req.body;
    console.log('Updating task status:', { id: req.params.id, status, order });
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        order,
        completed: status === 'Completed'
      },
      { new: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    console.log('Task updated successfully:', updatedTask);
    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ error: err.message });
  }
});

// ➤ Toggle task completion
app.patch("/tasks/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
