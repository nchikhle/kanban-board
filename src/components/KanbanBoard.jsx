import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent } from "@/components/ui/card";

const initialData = {
  todo: [{ id: uuidv4(), text: "Design UI" }],
  progress: [{ id: uuidv4(), text: "Implement Kanban" }],
  done: [{ id: uuidv4(), text: "Initial Planning" }],
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialData);
  const [newTask, setNewTask] = useState({ todo: "", progress: "", done: "" });

  const moveTask = (taskId, from, to) => {
    setTasks(prev => {
      const taskToMove = prev[from].find(t => t.id === taskId);
      return {
        ...prev,
        [from]: prev[from].filter(t => t.id !== taskId),
        [to]: [...prev[to], taskToMove],
      };
    });
  };

  const handleAddTask = (col) => {
    if (!newTask[col].trim()) return;
    const taskObj = { id: uuidv4(), text: newTask[col].trim() };
    setTasks(prev => ({ ...prev, [col]: [...prev[col], taskObj] }));
    setNewTask(prev => ({ ...prev, [col]: "" }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {Object.entries(tasks).map(([col, items]) => (
        <div key={col} className={`p-4 rounded-xl shadow-md ${col === "todo" ? "bg-blue-50" : col === "progress" ? "bg-yellow-50" : "bg-green-50"}`}>
          <h2 className="text-lg font-bold capitalize mb-4">
            {col === "todo" ? "📝 To-Do" : col === "progress" ? "🔧 In Progress" : "✅ Done"}
          </h2>

          <div className="mb-3 flex space-x-2">
            <input
              type="text"
              placeholder="New Task..."
              className="flex-1 border p-2 rounded text-sm"
              value={newTask[col]}
              onChange={(e) => setNewTask(prev => ({ ...prev, [col]: e.target.value }))}
            />
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              onClick={() => handleAddTask(col)}
            >
              Add
            </button>
          </div>

          <CardContent>
            {items.map(task => (
              <Card key={task.id} className="flex justify-between items-center">
                <span>{task.text}</span>
                <div className="flex space-x-1">
                  {Object.keys(tasks).filter(c => c !== col).map(dest => (
                    <button
                      key={dest}
                      className="text-xs text-blue-500 hover:underline"
                      onClick={() => moveTask(task.id, col, dest)}
                    >
                      ➡ {dest}
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </CardContent>
        </div>
      ))}
    </div>
  );
}
