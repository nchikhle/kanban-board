import { Droppable, Draggable } from "@hello-pangea/dnd";
import { CardContent } from "@/components/ui/Card";
import TaskCard from "./TaskCard";
import TaskInput from "./TaskInput";


export default function Column({ col, tasks, newTaskValue, onNewTaskChange, onAddTask, showError, editingTask, setEditingTask, onDeleteTask, onSaveEditTask }) {
  return (
    <div className={`p-4 rounded-xl shadow-md ${col === "todo" ? "bg-blue-50" : col === "progress" ? "bg-yellow-50" : "bg-green-50"}`}>
      <h2 className="text-lg font-bold capitalize mb-4">
        {col === "todo" ? "📝 To-Do" : col === "progress" ? "🔧 In Progress" : "✅ Done"}
      </h2>
      <TaskInput
        value={newTaskValue}
        onChange={onNewTaskChange}
        onAdd={onAddTask}
        showError={showError}
      />
      <Droppable droppableId={col}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[100px] ${snapshot.isDraggingOver ? "bg-gray-100" : ""}`}
          >
            <CardContent>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-2">
                      <TaskCard
                        task={task}
                        isEditing={editingTask.id === task.id}
                        editingText={editingTask.text}
                        onEditChange={(e) => setEditingTask((prev) => ({ ...prev, text: e.target.value }))}
                        onSaveEdit={onSaveEditTask}
                        onStartEdit={() => setEditingTask({ id: task.id, text: task.text, col })}
                        onDelete={() => onDeleteTask(col, task.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </CardContent>
          </div>
        )}
      </Droppable>
    </div>
  );
}
