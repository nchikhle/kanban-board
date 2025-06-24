import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const initialData = {
  todo: ["Design UI", "Setup Project"],
  progress: ["Implement Kanban"],
  done: ["Initial Planning"],
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialData);

  const moveTask = (task, from, to) => {
    setTasks(prev => {
      const updatedFrom = prev[from].filter(t => t !== task);
      const updatedTo = [...prev[to], task];
      return { ...prev, [from]: updatedFrom, [to]: updatedTo };
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {Object.entries(tasks).map(([col, items]) => (
        <div key={col} className={`p-2 rounded-xl ${col === "todo" ? "bg-blue-50" : col === "progress" ? "bg-yellow-50" : "bg-green-50"}`}>
          <h2 className="text-lg font-bold capitalize mb-2">
            {col === "todo" ? "📝 To-Do" : col === "progress" ? "🔧 In Progress" : "✅ Done"}
          </h2>
          <CardContent>
            {items.map(task => (
              <Card key={task} className="flex justify-between items-center">
                <span>{task}</span>
                <div className="flex space-x-1">
                  {Object.keys(tasks).filter(c => c !== col).map(dest => (
                    <button 
                      key={dest} 
                      className="text-xs text-blue-500 hover:underline" 
                      onClick={() => moveTask(task, col, dest)}
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
