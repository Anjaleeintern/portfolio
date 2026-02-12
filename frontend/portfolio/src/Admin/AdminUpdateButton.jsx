// ADMIN UPDATE BUTTON COMPONENT

export default function AdminUpdateButton({ onClick, label = "Update" }) {
  return (
    <button
      onClick={onClick}
      className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium 
      bg-cyan-500 hover:bg-cyan-400 text-black 
      rounded-lg shadow-sm hover:shadow-cyan-400/20 
      transition-all duration-200 hover:-translate-y-0.5"
    >
      ✏ {label}
    </button>
  );
}
