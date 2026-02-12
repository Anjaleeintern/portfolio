// AdminControls.jsx

export default function AdminControls({ onAdd, onEdit, onDelete }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 justify-start">
      
      {onAdd && (
        <button
          onClick={onAdd}
          className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg 
          bg-emerald-500/90 hover:bg-emerald-400 text-black 
          shadow-sm hover:shadow-emerald-400/20 
          transition-all duration-200 hover:-translate-y-0.5"
        >
          ➕ Add
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg 
          bg-amber-500/90 hover:bg-amber-400 text-black 
          shadow-sm hover:shadow-amber-400/20 
          transition-all duration-200 hover:-translate-y-0.5"
        >
          ✏ Edit
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg 
          bg-red-600 hover:bg-red-500 text-white 
          shadow-sm hover:shadow-red-500/20 
          transition-all duration-200 hover:-translate-y-0.5"
        >
          🗑 Delete
        </button>
      )}

    </div>
  );
}

