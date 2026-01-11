from flask import Flask, jsonify

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

if __name__ == "__main__":
    app.run(debug = True)