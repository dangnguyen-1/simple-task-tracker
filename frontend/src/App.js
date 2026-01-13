import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add task state
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("todo");

  // Edit task state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("todo");

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

  async function handleAddTask(e) {
    e.preventDefault();

    const title = newTitle.trim();
    if (!title) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status: newStatus }),
      });

      if (!res.ok) {
        console.error("Failed to add task");
        return;
      }

      const createdTask = await res.json();
      setTasks((prev) => [...prev, createdTask]);
      setNewTitle("");
      setNewStatus("todo");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditStatus(task.status);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditStatus("todo");
  }

  async function saveEdit(taskId) {
    const title = editTitle.trim();
    if (!title) return;

    try {
      const res = await fetch("/api/tasks/" + taskId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status: editStatus }),
      });

      if (!res.ok) {
        console.error("Failed to update task");
        return;
      }

      const updatedTask = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

      cancelEditing();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  }

  return (
    <div className="app-container">
      <h1 className="title">Task Tracker</h1>

      {/* Add Task */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          className="add-task-input"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task..."
        />

        <select
          className="status-select"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="todo">todo</option>
          <option value="in-progress">in-progress</option>
          <option value="done">done</option>
        </select>

        <button className="add-task-button" type="submit">
          Add
        </button>
      </form>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item status-${task.status}`}>
              <div className="task-left">
                {editingId === task.id ? (
                  <input
                    className="edit-task-input"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  <div className="task-title">{task.title}</div>
                )}
              </div>

              <div className="task-right">
                {editingId === task.id ? (
                  <select
                    className="status-select"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="todo">todo</option>
                    <option value="in-progress">in-progress</option>
                    <option value="done">done</option>
                  </select>
                ) : (
                  <div className="task-status">{task.status}</div>
                )}

                <div className="task-actions">
                  {editingId === task.id ? (
                    <>
                      <button
                        type="button"
                        className="task-button"
                        onClick={() => saveEdit(task.id)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="task-button"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="task-button"
                      onClick={() => startEditing(task)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;