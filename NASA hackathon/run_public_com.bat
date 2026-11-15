@echo off
title ASTROCADE - Localhost to Public .COM Server
color 0B
echo ===============================================================================
echo   ASTROCADE: BEYOND THE HORIZON
echo   Localhost to Live .COM Public Server Launcher
echo ===============================================================================
echo.
echo [1/2] Starting local Python web server on port 8000...
start /B "" python -m http.server 8000 > nul 2>&1
timeout /t 2 > nul

echo [2/2] Bridging localhost:8000 to public live .com / HTTPS tunnel...
echo.
echo -------------------------------------------------------------------------------
echo Connecting via Cloudflare Quick Tunnel...
echo Your public live URL will appear below (look for: https://....trycloudflare.com)
echo Share that link with judges or open it on any phone / tablet / computer!
echo -------------------------------------------------------------------------------
echo.

npx --yes @cloudflare/cloudflared tunnel --url http://localhost:8000

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Cloudflare tunnel returned an error, falling back to LocalTunnel...
    npx --yes localtunnel --port 8000
)

pause
