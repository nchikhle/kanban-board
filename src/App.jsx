import KanbanBoard from "./components/KanbanBoard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 text-2xl font-bold text-center">🚀 Kanban Task Board</header>
      <KanbanBoard />
    </div>
  );
}
