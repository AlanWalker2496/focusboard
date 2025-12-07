import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Stats() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks") || "[]"));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("streak") || 0));

  const data = [
    { name: "Mon", tasks: 2 },
    { name: "Tue", tasks: 3 },
    { name: "Wed", tasks: 1 },
    { name: "Thu", tasks: 4 },
    { name: "Fri", tasks: 2 },
    { name: "Sat", tasks: 5 },
    { name: "Sun", tasks: 3 },
  ]; // Example data, can be dynamic

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-3xl bg-gray-900/50 backdrop-blur-xl shadow-xl"
    >
      <h2 className="text-xl font-bold mb-4">Statistics</h2>
      <div className="mb-4">🔥 Current Streak: {streak}</div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="tasks" fill="#4ade80" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
