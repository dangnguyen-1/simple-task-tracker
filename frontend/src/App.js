import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Store tasks fetched from the backend API
  const [tasks, setTasks] = useState([]);

  // Controls the Loading... UI
  const [loading, setLoading] = useState(true);

  // Add task state
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("todo");

  // Edit task state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("todo");

  // Fetch tasks once when the App component mounts
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);

        // GET tasks from backend
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

  // Handle form submission to add a new task
  async function handleAddTask(e) {

    // prevent full-page refresh
    e.preventDefault();

    const title = newTitle.trim();
    if (!title) return;

    try {
      // POST (add) a new task to the backend
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status: newStatus }),
      });

      if (!res.ok) {
        console.error("Failed to add task");
        return;
      }

      // Backend returns the created task (including new id)
      const createdTask = await res.json();

      // Update UI locally without re-fetching everything
      setTasks((prev) => [...prev, createdTask]);

      // Reset the form inputs
      setNewTitle("");
      setNewStatus("todo");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  }

  // Enter edit mode for a specific task (pre-fill form fields)
  function startEditing(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditStatus(task.status);
  }

  // Exit edit mode without saving
  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditStatus("todo");
  }

  // Save edits (title + status) to backend via PUT
  async function saveEdit(taskId) {
    const title = editTitle.trim();

    // Prevent empty title
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

      // Update the edited task
      const updatedTask = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

      // Leave edit mode after saving
      cancelEditing();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  }

  // Task Tracker page UI
  return (

    // Main container & title
    <div className="app-container">
      <h1 className="title">Task Tracker</h1>
      
      {/* Add task form */}
      <form onSubmit={handleAddTask} className="add-task-form">

        {/* Task title input */}
        <input
          className="add-task-input"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task..."
        />

        {/* Status dropdown */}
        <select
          className="status-select"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="todo">todo</option>
          <option value="in-progress">in-progress</option>
          <option value="done">done</option>
        </select>

        {/* Submit button */}
        <button className="add-task-button" type="submit">
          Add
        </button>
      </form>

      {/* Loading vs task list (conditional rendering) */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <ul className="task-list">

          {/* Render task list */}
          {tasks.map((task) => (
            <li key={task.id} className={`task-item status-${task.status}`}>

              {/* Task left side: title or edit input */}
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

              {/* Task right side: status or status dropdown */}
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

                {/* Buttons: Edit OR Save/Cancel */}
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