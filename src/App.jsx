import { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TaskItem from "./components/TaskItem";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [subject, setSubject] = useState("general");
  const [dueDate, setDueDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priority: "",
    subject: "",
    status: ""
  });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchTasks();
    checkTimeForReminder();
  }, [sortBy, sortOrder, searchQuery, filters]);

  const checkTimeForReminder = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 21 || hour < 1) {
      // Show reminder
      showReminder();
    }
  };

  const showReminder = () => {
    // Implement reminder logic here
    console.log("Showing reminder for next day's schedule");
  };

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams({
        sortBy,
        sortOrder,
        search: searchQuery,
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.status && { status: filters.status })
      });
      const response = await fetch(`${API_URL}/tasks?${queryParams}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        console.log('Attempting to add task:', {
          title: newTask,
          description: newTask,
          priority: priority || "medium",
          subject,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          status: 'To Do'
        });

        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newTask,
            description: newTask,
            priority: priority || "medium",
            subject,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            status: 'To Do'
          }),
        });

        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Response data:', responseData);

        if (response.ok) {
          setTasks([responseData, ...tasks]);
          setNewTask("");
          setPriority("medium");
          setSubject("general");
          setDueDate("");
        } else {
          console.error('Failed to add task:', response.statusText);
          console.error('Error details:', responseData);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const updateTaskStatus = async (taskId, newStatus, newOrder) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, order: newOrder }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => 
          task._id === taskId ? updatedTask : task
        ));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/toggle`, {
        method: 'PATCH',
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => 
          task._id === taskId ? updatedTask : task
        ));
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const savedTask = await response.json();
        setTasks(tasks.map(task => 
          task._id === taskId ? savedTask : task
        ));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        📝 CollabTask - To-Do List
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid columns={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              label="New Task"
              variant="outlined"
              fullWidth
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </Grid>
          <Grid columns={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value)}
                size="small"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid columns={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={subject}
                label="Subject"
                onChange={(e) => setSubject(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Physics">Physics</MenuItem>
                <MenuItem value="Chemistry">Chemistry</MenuItem>
                <MenuItem value="Biology">Biology</MenuItem>
                <MenuItem value="Maths">Maths</MenuItem>
                <MenuItem value="Second Language">Second Language</MenuItem>
                <MenuItem value="Geography">Geography</MenuItem>
                <MenuItem value="History">History</MenuItem>
                <MenuItem value="Economics">Economics</MenuItem>
                <MenuItem value="Computer">Computer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid columns={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              size="small"
              value={dueDate || ''}
              onChange={(e) => setDueDate(e.target.value)}
              InputProps={{
                startAdornment: (
                  <CalendarTodayIcon 
                    sx={{ 
                      mr: 1, 
                      color: 'text.secondary',
                      fontSize: '1.2rem'
                    }} 
                  />
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'background.paper',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  '&.Mui-focused': {
                    color: 'primary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid columns={{ xs: 12, sm: 6, md: 2 }}>
            <Button variant="contained" color="primary" onClick={addTask} fullWidth>
              Add Task
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid columns={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              label="Search tasks"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid columns={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
              >
                <MenuItem value="createdAt">Created Date</MenuItem>
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid columns={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                label="Order"
                onChange={(e) => setSortOrder(e.target.value)}
                size="small"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid columns={{ xs: 12, sm: 6, md: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              fullWidth
            >
              Filters
            </Button>
          </Grid>
          <Grid columns={{ xs: 12, sm: 6, md: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setViewMode(viewMode === "list" ? "kanban" : "list")}
              fullWidth
            >
              {viewMode === "list" ? "Kanban View" : "List View"}
            </Button>
          </Grid>
        </Grid>

        <Collapse in={showFilters} timeout={300}>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                label="Priority"
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                size="small"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Subject</InputLabel>
              <Select
                value={filters.subject}
                label="Subject"
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                size="small"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Physics">Physics</MenuItem>
                <MenuItem value="Chemistry">Chemistry</MenuItem>
                <MenuItem value="Biology">Biology</MenuItem>
                <MenuItem value="Maths">Maths</MenuItem>
                <MenuItem value="Second Language">Second Language</MenuItem>
                <MenuItem value="Geography">Geography</MenuItem>
                <MenuItem value="History">History</MenuItem>
                <MenuItem value="Economics">Economics</MenuItem>
                <MenuItem value="Computer">Computer</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
                size="small"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => setFilters({ priority: "", subject: "", status: "" })}
              sx={{ alignSelf: 'flex-end' }}
            >
              Clear Filters
            </Button>
          </Box>
        </Collapse>
      </Paper>

      {viewMode === "list" ? (
        <Box>
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onToggle={toggleTask}
            />
          ))}
        </Box>
      ) : (
        <KanbanBoard
          tasks={tasks}
          onUpdateTaskStatus={updateTaskStatus}
          onDelete={deleteTask}
          onUpdate={updateTask}
          onToggle={toggleTask}
        />
      )}
    </Container>
  );
}

export default App;
