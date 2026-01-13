# Task Tracker (Flask + React)

## Overview

This project is a simple full-stack task tracker built with:
- **Backend:** Flask (Python)
- **Frontend:** React (Create React App)

Tasks are stored in an **in-memory list** (no database). This keeps the project lightweight and easy to run locally.

---

## Features

- Fetch and display tasks from the backend
- Add a new task with a selected status (`todo`, `in-progress`, `done`)
- Edit an existing task's title and status

> **Note:** Data resets whenever the Flask server restarts.

---

## Installation

1. Clone the repository
   ```sh
   git clone <REPO_URL>
   ```

2. Navigate to the project directory
   ```sh
   cd <REPO_FOLDER_NAME>
   ```

---

## Setup (with Makefile)

### 1) Install dependencies (first time only)
```bash
make setup
```

### 2) Run (starts backend + frontend)
```bash
make run
```

### 3) Stop the app
Press:
```bash
Ctrl + C
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://127.0.0.1:5000/api/tasks

---

## Manual Setup (without Makefile)

### Backend (Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask
python3 app.py
```

- **Backend runs at:** http://127.0.0.1:5000

### Frontend (React)

In a new terminal:

```bash
cd frontend
npm install
npm start
```

- **Frontend runs at:**: http://localhost:3000

---

## Development Notes

### Python Virtual Environment

The backend uses a Python virtual environment located at:

```bash
backend/venv
```

### React Proxy

The frontend uses a development proxy so API calls can be written cleanly as:

```js
fetch("/api/tasks")
```

This is configured in `frontend/package.json`:

```json
"proxy": "http://127.0.0.1:5000"
```

---
