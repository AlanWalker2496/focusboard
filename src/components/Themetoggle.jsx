export default function ThemeToggle({ theme, setTheme }) {
  const themes = ["light", "dark", "neon", "cyberpunk"];
  return (
    <div className="flex gap-2 mt-4">
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`px-3 py-1 rounded-xl ${
            theme === t ? "bg-blue-600 text-white" : "bg-gray-700/50"
          }`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
