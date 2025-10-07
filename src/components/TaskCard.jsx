import { Card } from "@/components/ui/Card";

export default function TaskCard({ task, isEditing, editingText, onEditChange, onSaveEdit, onStartEdit, onDelete }) {
  return (
    <Card className="flex justify-between items-center p-2">
      {isEditing ? (
        <div className="flex w-full space-x-2">
          <input
            type="text"
            className="flex-1 border p-1 text-sm rounded"
            value={editingText}
            onChange={onEditChange}
          />
          <button className="text-green-500 text-xs hover:underline" onClick={onSaveEdit}>Save</button>
        </div>
      ) : (
        <>
          <span>{task.text}</span>
          <div className="flex space-x-2">
            <button className="text-blue-500 text-xs hover:underline" onClick={onStartEdit}>Edit</button>
            <button className="text-red-500 text-xs hover:underline" onClick={onDelete}>Delete</button>
          </div>
        </>
      )}
    </Card>
  );
}