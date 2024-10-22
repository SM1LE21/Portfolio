#!/bin/bash
cd "/var/www/Portfolio/TK Chat/backend"
source venv/bin/activate
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
