.PHONY: setup backend frontend run clean

setup:
	cd backend && python3 -m venv venv
	cd backend && ./venv/bin/pip install flask
	cd frontend && npm install

backend:
	cd backend && ./venv/bin/python app.py

frontend:
	cd frontend && npm start

run:
	$(MAKE) -j 2 backend frontend

clean:
	rm -rf backend/venv
	rm -rf frontend/node_modules