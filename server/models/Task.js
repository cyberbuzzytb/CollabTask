import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  category: { type: String, default: 'general' },
  subject: { 
    type: String, 
    enum: [
      'English', 'Physics', 'Chemistry', 'Biology', 'Maths', 
      'Second Language', 'Geography', 'History', 'Economics', 
      'Computer', 'general'
    ], 
    default: 'general' 
  },
  status: { 
    type: String, 
    enum: ['To Do', 'In Progress', 'Completed'], 
    default: 'To Do' 
  },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Task = mongoose.model("Task", taskSchema);
export default Task;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
