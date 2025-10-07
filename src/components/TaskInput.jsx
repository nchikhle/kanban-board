export default function TaskInput({ value, onChange, onAdd, showError }) {
  return (
    <div className="mb-3 flex flex-col space-y-1">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="New Task..."
          className="flex-1 border p-2 rounded text-sm"
          value={value}
          onChange={onChange}
        />
        <button
          className={`px-3 py-1 rounded text-sm ${
            !value.trim()
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={onAdd}
          disabled={!value.trim()}
        >
          Add
        </button>
      </div>
      {showError && <span className="text-sm text-red-500">Task name cannot be empty.</span>}
    </div>
  );
}