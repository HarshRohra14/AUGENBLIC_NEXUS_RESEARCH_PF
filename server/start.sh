#!/bin/bash
# Install Python dependencies
cd python_ai && pip install -r requirements.txt

# Start Python service in background
python -m uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start Node.js server
cd .. && npm start