import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const res = await fetch("/api/tasks");
        const data = await res.json();
        setTasks(data);

        // Force loading state to be visible (demo)
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">Task Tracker</h1>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item status-${task.status}`}>
              <div className="task-title">{task.title}</div>
              <div className="task-status">{task.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;