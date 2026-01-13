from flask import Flask, jsonify, request

app = Flask(__name__)

# In-memory data store
TASKS = [
    {"id": 1, "title": "Finalize co-op resume", "status": "done"},
    {"id": 2, "title": "Complete TC take-home challenge", "status": "in-progress"},
    {"id": 3, "title": "Prepare for TAMID Fellowship interview", "status": "todo"},
]

@app.get("/api/tasks")
def get_tasks():
    return jsonify(TASKS)

# Add taks
@app.post("/api/tasks")
def add_task():
    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "title is required"}), 400

    status = data.get("status", "todo")

    new_id = max(task["id"] for task in TASKS) + 1 if TASKS else 1
    new_task = {"id": new_id, "title": title, "status": status}
    TASKS.append(new_task)

    return jsonify(new_task), 201

# Edit tasks
@app.put("/api/tasks/<int:task_id>")
def update_task_title(task_id):
    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    if not title:
        return jsonify({"error": "title is required"}), 400

    for task in TASKS:
        if task["id"] == task_id:
            task["title"] = title
            return jsonify(task)

    return jsonify({"error": "task not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)