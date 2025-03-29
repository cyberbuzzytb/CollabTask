import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Checkbox, 
  Chip,
  Box,
  Menu,
  MenuItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

const TaskItem = ({ task, onDelete, onUpdate, onToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleSave = async () => {
    try {
      await onUpdate(task._id, editedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task._id);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Checkbox
            checked={task.completed}
            onChange={() => onToggle(task._id)}
            color="primary"
            sx={{ mt: 0.5 }}
          />
          
          {isEditing ? (
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                size="small"
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                size="small"
                multiline
                rows={2}
                sx={{ mb: 1 }}
              />
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editedTask.priority}
                  label="Priority"
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel} size="small">
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary" size="small">
                  Save
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary'
                }}
              >
                {task.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {task.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip 
                  label={task.priority} 
                  size="small" 
                  color={getPriorityColor(task.priority)}
                />
                {task.category && (
                  <Chip 
                    label={task.category} 
                    size="small" 
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
          
          <Box>
            <IconButton onClick={handleMenuClick} size="small">
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Card>
  );
};

export default TaskItem;
