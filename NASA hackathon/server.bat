@echo off
echo ============================================================
echo   Project Starbridge: Junior Astronaut & Space Base Commander
echo   Local Web Server (Python)
echo ============================================================
echo Starting local web server at http://localhost:8000
start "" "http://localhost:8000"
python -m http.server 8000
pause

