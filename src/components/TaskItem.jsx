import { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const TaskItem = ({ task, onDelete, onUpdate, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate(task._id, editedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  if (isEditing) {
    return (
      <ListItem
        sx={{
          bgcolor: "background.paper",
          mb: 1,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <TextField
            fullWidth
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            size="small"
            multiline
            rows={2}
            sx={{ mb: 1 }}
          />
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label={editedTask.subject}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={editedTask.priority}
              size="small"
              color={getPriorityColor(editedTask.priority)}
            />
          </Stack>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </Box>
      </ListItem>
    );
  }

  return (
    <ListItem
      sx={{
        bgcolor: "background.paper",
        mb: 1,
        borderRadius: 1,
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ width: "100%", display: "flex", alignItems: "flex-start" }}>
        <Checkbox
          edge="start"
          checked={task.completed}
          onChange={() => onToggle(task._id)}
          sx={{ mt: 0.5 }}
        />
        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              sx={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "text.secondary" : "text.primary",
              }}
            >
              {task.title}
            </Typography>
          }
          secondary={
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                {task.description}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Chip
                  label={task.subject}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={task.priority}
                  size="small"
                  color={getPriorityColor(task.priority)}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                  <CalendarTodayIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                  <Typography variant="caption">
                    {formatDate(task.dueDate)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          }
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleEdit} sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" onClick={() => onDelete(task._id)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </Box>
    </ListItem>
  );
};

export default TaskItem;
