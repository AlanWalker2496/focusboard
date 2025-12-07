import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Pomodoro from "./components/Pomodoro";
import Tasks from "./components/Tasks";
import Stats from "./components/Stats";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  // Current active page
  const [activePage, setActivePage] = useState("pomodoro");

  // Theme: light, dark, neon, cyberpunk
  const [theme, setTheme] = useState("dark");

  // Function to render current page
  const renderPage = () => {
    switch (activePage) {
      case "pomodoro":
        return <Pomodoro theme={theme} />;
      case "tasks":
        return <Tasks />;
      case "stats":
        return <Stats />;
      case "settings":
        return <ThemeToggle theme={theme} setTheme={setTheme} />;
      default:
        return <Pomodoro theme={theme} />;
    }
  };

  // Theme classes
  const themeClasses =
    theme === "light"
      ? "bg-gray-100 text-black"
      : theme === "dark"
      ? "bg-gray-900 text-white"
      : theme === "neon"
      ? "bg-gradient-to-br from-purple-800 via-pink-600 to-blue-500 text-white"
      : "bg-gradient-to-br from-purple-900 via-pink-700 to-blue-800 text-white"; // cyberpunk

  return (
    <div className={`flex min-h-screen font-[Inter] transition-all ${themeClasses}`}>
      {/* Sidebar */}
      <Sidebar active={activePage} setActive={setActivePage} />

      {/* Main content */}
      <main className="flex-1 p-8">{renderPage()}</main>
    </div>
  );
}
