import { TextField, Button, Box } from "@mui/material";
import { useState } from "react";

const TaskInput = ({ onAdd }) => {
  const [task, setTask] = useState("");

  const handleAdd = () => {
    if (task.trim() !== "") {
      onAdd(task);
      setTask("");
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      <TextField
        label="Add a new task"
        variant="outlined"
        fullWidth
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <Button variant="contained" onClick={handleAdd}>
        Add
      </Button>
    </Box>
  );
};

export default TaskInput;
