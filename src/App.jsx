import React, { useState, useEffect, useRef } from 'react'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tasks') || '[]')
    } catch (e) {
      return []
    }
  })
  const [text, setText] = useState('')
  const [timer, setTimer] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState('focus')
  const [quote, setQuote] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            const nextMode = mode === 'focus' ? 'break' : 'focus'
            setMode(nextMode)
            return nextMode === 'focus' ? 25 * 60 : 5 * 60
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  useEffect(() => {
    fetchQuote()
  }, [])

  async function fetchQuote() {
    try {
      const res = await fetch('https://api.quotable.io/random')
      if (!res.ok) throw new Error('fail')
      const data = await res.json()
      setQuote(data)
    } catch (e) {
      setQuote({ content: 'Keep shipping. Small steps win.', author: '—' })
    }
  }

  function addTask() {
    if (!text.trim()) return
    setTasks((t) => [{ id: Date.now(), text: text.trim(), done: false }, ...t])
    setText('')
  }

  function toggle(id) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
  }

  function removeTask(id) {
    setTasks((t) => t.filter((x) => x.id !== id))
  }

  function clearDone() {
    setTasks((t) => t.filter((x) => !x.done))
  }

  function startPause() {
    setRunning((r) => !r)
  }

  function resetTimer() {
    setRunning(false)
    setMode('focus')
    setTimer(25 * 60)
  }

  function quickSet(minutes) {
    setTimer(minutes * 60)
  }

  function exportTasks() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'tasks.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function importTasks(e) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const arr = JSON.parse(reader.result)
        if (Array.isArray(arr)) setTasks(arr)
      } catch (e) {
        alert('Invalid JSON')
      }
    }
    reader.readAsText(f)
  }

  const fmt = (s) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0')
    const ss = Math.floor(s % 60).toString().padStart(2, '0')
    return `${mm}:${ss}`
  }

  return (
    <div className="min-h-screen p-6 flex items-start justify-center">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8">
        {/* Task Panel */}
        <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-lg border border-white/20 shadow-lg">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">FocusBoard</h1>
              <p className="text-sm text-white/60">Tasks + Pomodoro — quick deploy</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/60">Mode</div>
              <div className="text-sm font-medium">{mode === 'focus' ? 'Focus' : 'Break'}</div>
            </div>
          </header>

          {/* Input */}
          <section className="mb-4">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a task or quick note"
                className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/60 text-white"
              />
              <button className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition duration-300 font-semibold shadow-md" onClick={addTask}>
                Add
              </button>
            </div>
            <div className="mt-3 flex gap-2 text-sm text-white/70">
              <button onClick={() => quickSet(25)} className="px-2 py-1 bg-white/5 rounded transition hover:bg-white/10">
                25m
              </button>
              <button onClick={() => quickSet(15)} className="px-2 py-1 bg-white/5 rounded transition hover:bg-white/10">
                15m
              </button>
              <button onClick={() => quickSet(5)} className="px-2 py-1 bg-white/5 rounded transition hover:bg-white/10">
                5m
              </button>
              <button onClick={clearDone} className="ml-auto px-2 py-1 bg-red-600/60 rounded hover:bg-red-500 transition">
                Clear Done
              </button>
            </div>
          </section>

          {/* Task list */}
          <ul className="space-y-2 max-h-[36vh] overflow-auto pr-2">
            {tasks.length === 0 && <li className="text-sm text-white/50">No tasks yet — add one and start the timer.</li>}
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition"
              >
                <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} className="w-5 h-5 accent-indigo-500" />
                <div className={`${t.done ? 'line-through text-white/60' : 'text-white'} flex-1 text-sm md:text-base`}>{t.text}</div>
                <button onClick={() => removeTask(t.id)} className="text-white/60 hover:text-red-400 transition">
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {/* Export / Import */}
          <footer className="mt-4 flex items-center gap-2 text-sm">
            <label className="flex items-center gap-2">
              Export
              <button onClick={exportTasks} className="ml-2 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 transition">
                JSON
              </button>
            </label>
            <label className="ml-auto flex items-center gap-2">
              Import
              <input onChange={importTasks} type="file" accept="application/json" className="ml-2 text-xs" />
            </label>
          </footer>
        </div>

        {/* Pomodoro Panel */}
        <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-lg border border-white/20 shadow-lg flex flex-col items-center justify-between">
          <div className="flex flex-col items-center gap-4 w-full">
            <h2 className="text-2xl font-bold text-white">Pomodoro Timer</h2>
            <div
              className={`w-44 h-44 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                mode === 'focus' ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-green-500'
              }`}
            >
              <div className="text-3xl font-mono text-white">{fmt(timer)}</div>
            </div>
            <div className="mt-4 flex gap-4">
              <button onClick={startPause} className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition duration-300 shadow-md">
                {running ? 'Pause' : 'Start'}
              </button>
              <button onClick={resetTimer} className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition duration-300">
                Reset
              </button>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-6 border-t border-white/20 pt-4 w-full text-center">
            <p className="text-white/70 italic text-sm md:text-base">{quote ? `"${quote.content}" — ${quote.author}` : 'Loading...'}</p>
            <button onClick={fetchQuote} className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
              New Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
