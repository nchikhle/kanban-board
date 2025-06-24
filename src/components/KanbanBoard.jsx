import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "kanban-tasks";

const defaultData = {
  todo: [{ id: uuidv4(), text: "Design UI" }],
  progress: [{ id: uuidv4(), text: "Implement Kanban" }],
  done: [{ id: uuidv4(), text: "Initial Planning" }],
};

 // Load tasks from localStorage
 const getInitialTasks = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.todo && parsed.progress && parsed.done) {
        return parsed;
      }
    } catch (err) {
      // ignore
    }
  }
  return {
    todo: [{ id: uuidv4(), text: "Design UI" }],
    progress: [{ id: uuidv4(), text: "Implement Kanban" }],
    done: [{ id: uuidv4(), text: "Initial Planning" }],
  };
};

export default function KanbanBoard() {
 const [tasks, setTasks] = useState(getInitialTasks);
  const [newTask, setNewTask] = useState({ todo: "", progress: "", done: "" });
  const [editingTask, setEditingTask] = useState({ id: null, text: "", col: "" });

 

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    console.log("Saved tasks to localStorage:", tasks);
  }, [tasks]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

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

  const handleDeleteTask = (col, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [col]: prev[col].filter((task) => task.id !== taskId),
    }));
  };

  const handleEditTask = (col, task) => {
    setEditingTask({ id: task.id, text: task.text, col });
  };

  const handleSaveEdit = () => {
    if (!editingTask.text.trim()) return;
    setTasks((prev) => ({
      ...prev,
      [editingTask.col]: prev[editingTask.col].map((task) =>
        task.id === editingTask.id ? { ...task, text: editingTask.text.trim() } : task
      ),
    }));
    setEditingTask({ id: null, text: "", col: "" });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {Object.entries(tasks).map(([col, items]) => (
          <div
            key={col}
            className={`p-4 rounded-xl shadow-md ${
              col === "todo" ? "bg-blue-50" : col === "progress" ? "bg-yellow-50" : "bg-green-50"
            }`}
          >
            <h2 className="text-lg font-bold capitalize mb-4">
              {col === "todo" ? "📝 To-Do" : col === "progress" ? "🔧 In Progress" : "✅ Done"}
            </h2>

            <div className="mb-3 flex space-x-2">
              <input
                type="text"
                placeholder="New Task..."
                className="flex-1 border p-2 rounded text-sm"
                value={newTask[col]}
                onChange={(e) => setNewTask((prev) => ({ ...prev, [col]: e.target.value }))}
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
                  className={`min-h-[100px] ${snapshot.isDraggingOver ? "bg-gray-100" : ""}`}
                >
                  <CardContent>
                    {items.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <Card className={`flex justify-between items-center p-2 ${snapshot.isDragging ? "bg-white shadow-lg" : ""}`}>
                              {editingTask.id === task.id ? (
                                <div className="flex w-full space-x-2">
                                  <input
                                    type="text"
                                    className="flex-1 border p-1 text-sm rounded"
                                    value={editingTask.text}
                                    onChange={(e) =>
                                      setEditingTask((prev) => ({ ...prev, text: e.target.value }))
                                    }
                                  />
                                  <button
                                    className="text-green-500 text-xs hover:underline"
                                    onClick={handleSaveEdit}
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span>{task.text}</span>
                                  <div className="flex space-x-2">
                                    <button
                                      className="text-blue-500 text-xs hover:underline"
                                      onClick={() => handleEditTask(col, task)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="text-red-500 text-xs hover:underline"
                                      onClick={() => handleDeleteTask(col, task.id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </>
                              )}
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
