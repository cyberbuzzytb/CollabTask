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
  Stack,
  Divider,
  Paper
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
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: 4,
            borderColor: 'primary.main'
          }
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
            sx={{ mb: 2 }}
            label="Title"
            variant="outlined"
          />
          <TextField
            fullWidth
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            size="small"
            multiline
            rows={3}
            sx={{ mb: 2 }}
            label="Description"
            variant="outlined"
          />
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Chip
              label={editedTask.subject}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ 
                fontWeight: 600,
                px: 1.5,
                py: 0.5
              }}
            />
            <Chip
              label={editedTask.priority}
              size="small"
              color={getPriorityColor(editedTask.priority)}
              sx={{ 
                fontWeight: 600,
                px: 1.5,
                py: 0.5
              }}
            />
          </Stack>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleCancel}
              color="error"
              sx={{ 
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              color="primary"
              sx={{ 
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
          borderColor: 'primary.main'
        }
      }}
    >
      <Box sx={{ width: "100%", display: "flex", alignItems: "flex-start" }}>
        <Checkbox
          edge="start"
          checked={task.completed}
          onChange={() => onToggle(task._id)}
          sx={{ 
            mt: 0.5,
            mr: 2,
            '&.Mui-checked': {
              color: 'primary.main'
            },
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'primary.main'
            }
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "text.secondary" : "text.primary",
              fontWeight: 600,
              mb: 1,
              fontSize: '1.1rem'
            }}
          >
            {task.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ 
              mb: 2,
              lineHeight: 1.6
            }}
          >
            {task.description}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Chip
              label={task.subject}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ 
                fontWeight: 600,
                px: 1.5,
                py: 0.5
              }}
            />
            <Chip
              label={task.priority}
              size="small"
              color={getPriorityColor(task.priority)}
              sx={{ 
                fontWeight: 600,
                px: 1.5,
                py: 0.5
              }}
            />
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: 'text.secondary',
                ml: 1,
                bgcolor: 'action.hover',
                px: 1.5,
                py: 0.5,
                borderRadius: 1
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: '1.1rem', mr: 0.5, color: 'primary.main' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatDate(task.dueDate)}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            edge="end" 
            onClick={handleEdit} 
            sx={{ 
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText'
              }
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            edge="end" 
            onClick={() => onDelete(task._id)}
            sx={{ 
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskItem;
