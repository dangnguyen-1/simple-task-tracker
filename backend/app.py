from flask import Flask, jsonify, request

app = Flask(__name__)

# In-memory data store (resets every time the server restarts)
TASKS = [
    {"id": 1, "title": "Finalize co-op resume", "status": "done"},
    {"id": 2, "title": "Complete TC take-home challenge", "status": "in-progress"},
    {"id": 3, "title": "Prepare for TAMID Fellowship interview", "status": "todo"},
]

ALLOWED_STATUSES = {"todo", "in-progress", "done"}

# Returns the full list of tasks as JSON
@app.get("/api/tasks")
def get_tasks():
    return jsonify(TASKS)

# Creates a new task: {title, status}
@app.post("/api/tasks")
def add_task():
    
    # Safely parse JSON body (returns {} if missing/invalid)
    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "title is required"}), 400

    status = data.get("status", "todo")
    if status not in ALLOWED_STATUSES:
        return jsonify({"error": "invalid status"}), 400

    # Generate a new unique task ID
    new_id = max(task["id"] for task in TASKS) + 1 if TASKS else 1
    new_task = {"id": new_id, "title": title, "status": status}
    TASKS.append(new_task)

    return jsonify(new_task), 201

# Updates an existing task's title and/or status
@app.put("/api/tasks/<int:task_id>")
def update_task(task_id):
    
    # Safely parse JSON body (returns {} if missing/invalid)
    data = request.get_json(silent=True) or {}

    title = data.get("title")
    status = data.get("status")

    # Validate provided fields
    if title is not None:
        title = title.strip()
        if not title:
            return jsonify({"error": "title cannot be empty"}), 400

    if status is not None and status not in ALLOWED_STATUSES:
        return jsonify({"error": "invalid status"}), 400

    for task in TASKS:
        if task["id"] == task_id:
            if title is not None:
                task["title"] = title
            if status is not None:
                task["status"] = status
            return jsonify(task)

    return jsonify({"error": "task not found"}), 404

# Delete an existing task by id
@app.delete("/api/tasks/<int:task_id>")
def delete_task(task_id):
    
    # Find the index of the task to delete
    for i, task in enumerate(TASKS):
        if task["id"] == task_id:
            deleted_task = TASKS.pop(i)
            return jsonify(deleted_task)

    return jsonify({"error": "task not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)