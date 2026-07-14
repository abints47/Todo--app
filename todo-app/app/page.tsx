"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    setNewTitle("");
    fetchTasks();
  }

  async function toggleTask(id: number, completed: boolean) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTasks();
  }

  async function deleteTask(id: number) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  }

  const remaining = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.length - remaining;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Tasks
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {loading
                ? "Loading..."
                : new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">
              {remaining}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              remaining
            </div>
          </div>
        </div>

        {/* Add task form */}
        <form onSubmit={addTask} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new task"
            className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 rounded-lg transition"
          >
            Add
          </button>
        </form>


        {/* Task list */}
        {loading ? (
          <div className="text-center text-slate-400 py-12 text-sm">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-slate-400 py-12 text-sm border border-dashed border-slate-300 rounded-lg bg-white">
            No tasks yet — add one above to get started.
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition"
              >
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition ${
                    task.completed
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-slate-300 hover:border-indigo-500"
                  }`}
                >
                  {task.completed && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                </button>

                <span
                  className={`flex-1 text-sm font-medium transition ${
                    task.completed
                      ? "line-through text-slate-400"
                      : "text-slate-800"
                  }`}
                >
                  {task.title}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition text-xs font-medium uppercase tracking-wide"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}