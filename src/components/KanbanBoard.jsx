import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";

const initialData = {
  todo: [{ id: uuidv4(), text: "Design UI" }],
  progress: [{ id: uuidv4(), text: "Implement Kanban" }],
  done: [{ id: uuidv4(), text: "Initial Planning" }],
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialData);
  const [newTask, setNewTask] = useState({ todo: "", progress: "", done: "" });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    setTasks((prev) => {
      const sourceList = Array.from(prev[source.droppableId]);
      const destList =
        source.droppableId === destination.droppableId
          ? sourceList
          : Array.from(prev[destination.droppableId]);

      const [movedTask] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, movedTask);

      return {
        ...prev,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList,
      };
    });
  };

  const handleAddTask = (col) => {
    if (!newTask[col].trim()) return;
    const taskObj = { id: uuidv4(), text: newTask[col].trim() };
    setTasks((prev) => ({ ...prev, [col]: [...prev[col], taskObj] }));
    setNewTask((prev) => ({ ...prev, [col]: "" }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {Object.entries(tasks).map(([col, items]) => (
          <div
            key={col}
            className={`p-4 rounded-xl shadow-md ${
              col === "todo"
                ? "bg-blue-50"
                : col === "progress"
                ? "bg-yellow-50"
                : "bg-green-50"
            }`}
          >
            <h2 className="text-lg font-bold capitalize mb-4">
              {col === "todo"
                ? "📝 To-Do"
                : col === "progress"
                ? "🔧 In Progress"
                : "✅ Done"}
            </h2>

            <div className="mb-3 flex space-x-2">
              <input
                type="text"
                placeholder="New Task..."
                className="flex-1 border p-2 rounded text-sm"
                value={newTask[col]}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, [col]: e.target.value }))
                }
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                onClick={() => handleAddTask(col)}
              >
                Add
              </button>
            </div>

            <Droppable droppableId={col}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[100px] ${
                    snapshot.isDraggingOver ? "bg-gray-100" : ""
                  }`}
                >
                  <CardContent>
                    {items.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card
                              className={`flex justify-between items-center mb-2 ${
                                snapshot.isDragging ? "bg-white shadow-lg" : ""
                              }`}
                            >
                              <span>{task.text}</span>
                            </Card>
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
        ))}
      </div>
    </DragDropContext>
  );
}
