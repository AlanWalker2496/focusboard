import { motion } from "framer-motion";

export default function Sidebar({ active, setActive }) {
  const items = [
    { name: "Pomodoro", key: "pomodoro" },
    { name: "Tasks", key: "tasks" },
    { name: "Stats", key: "stats" },
    { name: "Settings", key: "settings" },
  ];

  return (
    <motion.div
      className="w-52 bg-gray-900/50 backdrop-blur-lg p-6 rounded-r-3xl flex flex-col gap-4"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4">FocusBoard</h2>
      {items.map((item) => (
        <motion.div
          key={item.key}
          onClick={() => setActive(item.key)}
          className={`p-3 rounded-xl cursor-pointer transition-all ${
            active === item.key
              ? "bg-blue-600 text-white font-semibold"
              : "hover:bg-gray-700/50"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {item.name}
        </motion.div>
      ))}
    </motion.div>
  );
}
