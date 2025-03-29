import { List } from "@mui/material";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onDelete }) => {
  return (
    <List>
      {tasks.map((task, index) => (
        <TaskItem key={index} task={task} onDelete={onDelete} />
      ))}
    </List>
  );
};

export default TaskList;
