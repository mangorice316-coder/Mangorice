@echo off
title ASTROCADE - Zero-Install SSH Public Tunnel
color 0A
echo ===============================================================================
echo   ASTROCADE: Zero-Install Public Web Tunnel (via SSH)
echo ===============================================================================
echo.
echo [1/2] Starting local Python web server on port 8000...
start /B "" python -m http.server 8000 > nul 2>&1
timeout /t 2 > nul

echo [2/2] Generating public HTTPS URL via SSH tunnel...
echo (Look for the HTTPS URL displayed below)
echo.
ssh -p 443 -o StrictHostKeyChecking=no -R0:localhost:8000 a.pinggy.io
pause
