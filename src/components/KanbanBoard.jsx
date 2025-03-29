import { Box, Paper, Typography, Grid } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";

const KanbanBoard = ({ tasks = [], onUpdateTaskStatus, onDelete, onUpdate, onToggle }) => {
  const columns = {
    "To Do": tasks.filter((task) => task?.status === "To Do"),
    "In Progress": tasks.filter((task) => task?.status === "In Progress"),
    "Completed": tasks.filter((task) => task?.status === "Completed"),
  };

  const onDragEnd = (result) => {
    if (!result) return;
    
    const { destination, source, draggableId } = result;

    // Drop outside the list
    if (!destination) return;

    // Drop in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the task being dragged
    const task = tasks.find((t) => t?._id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId;
    const newOrder = destination.index;

    // Update the task status
    onUpdateTaskStatus(task._id, newStatus, newOrder);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container spacing={2}>
        {Object.entries(columns).map(([status, columnTasks]) => (
          <Grid item xs={12} sm={6} md={4} key={status}>
            <Paper
              sx={{
                p: 2,
                minHeight: "500px",
                backgroundColor: "background.default",
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <Typography variant="h6" gutterBottom>
                {status} ({columnTasks.length})
              </Typography>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ 
                      minHeight: "100px",
                      backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
                      transition: 'background-color 0.2s ease-in-out'
                    }}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task?._id || index}
                        draggableId={task?._id || `task-${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              mb: 1,
                              transform: snapshot.isDragging
                                ? provided.draggableProps.style?.transform
                                : "none",
                              transition: 'transform 0.2s ease-in-out',
                              '&:hover': {
                                transform: snapshot.isDragging
                                  ? provided.draggableProps.style?.transform
                                  : 'translateY(-2px)'
                              }
                            }}
                          >
                            <TaskItem
                              task={task}
                              onDelete={onDelete}
                              onUpdate={onUpdate}
                              onToggle={onToggle}
                            />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </DragDropContext>
  );
};

export default KanbanBoard; 
