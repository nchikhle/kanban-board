import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "kanban-tasks";

export const getInitialTasks = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.todo && parsed.progress && parsed.done) {
        return parsed;
      }
    } catch (err) {}
  }
  return {
    todo: [{ id: uuidv4(), text: "Design UI" }],
    progress: [{ id: uuidv4(), text: "Implement Kanban" }],
    done: [{ id: uuidv4(), text: "Initial Planning" }],
  };
};

export const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};