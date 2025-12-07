import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Tasks() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks") || "[]"));
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => localStorage.setItem("tasks", JSON.stringify(tasks)), [tasks]);

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { text: taskInput, done: false }]);
    setTaskInput("");
  };

  const toggleTask = (i) => {
    const updated = [...tasks];
    updated[i].done = !updated[i].done;
    setTasks(updated);
  };

  const deleteTask = (i) => setTasks(tasks.filter((_, idx) => idx !== i));
  const editTask = (i, newText) => {
    const updated = [...tasks];
    updated[i].text = newText;
    setTasks(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-3xl bg-gray-900/50 backdrop-blur-xl shadow-xl"
    >
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter a task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
        >
          Add
        </button>
      </div>
      <ul className="space-y-3">
        {tasks.map((task, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={`px-4 py-2 rounded-xl border bg-gray-800 flex justify-between items-center ${
              task.done ? "line-through opacity-60 border-gray-600" : "border-gray-700"
            }`}
          >
            <span onClick={() => toggleTask(i)} className="flex-1 cursor-pointer">
              {task.text}
            </span>
            <button
              className="text-yellow-400 hover:text-yellow-600 mx-2"
              onClick={() => {
                const newText = prompt("Edit task:", task.text);
                if (newText) editTask(i, newText);
              }}
            >
              ✏️
            </button>
            <button onClick={() => deleteTask(i)} className="text-red-400 hover:text-red-600">
              ✖
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
