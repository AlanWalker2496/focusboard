import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Pomodoro({ theme }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeout(() => setIsRunning(false), 0);
      setTimeout(() => {
        new Audio(
          "https://cdn.pixabay.com/audio/2022/03/15/audio_9a52e4b5ad.mp3"
        ).play();
      }, 0);
    }
  }, [timeLeft]);

  const resetTimer = () => setIsRunning(false) || setTimeLeft(25 * 60);
  const formatTime = (t) => `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`;
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <motion.div
      className="p-6 rounded-3xl bg-gray-900/50 backdrop-blur-xl shadow-xl text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-6xl font-mono mb-6">{formatTime(timeLeft)}</div>
      <div className="w-full bg-gray-700/40 h-2 rounded-full mb-6">
        <motion.div
          className="h-2 bg-blue-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        ></motion.div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
        >
          Reset
        </button>
      </div>
    </motion.div>
  );
}
