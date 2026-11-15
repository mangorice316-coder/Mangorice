@echo off
title Deploy ASTROCADE to Vercel (Permanent 24/7 .COM / Web Host)
color 0B
echo ===============================================================================
echo   ASTROCADE: BEYOND THE HORIZON
echo   Deploy to Vercel (Permanent 24/7 Hosting)
echo ===============================================================================
echo.
echo This will publish your game to a permanent, 24/7 live URL (e.g. https://astrocade.vercel.app)
echo You do NOT need to keep your PC running.
echo.
echo Press any key to start deployment...
pause > nul
echo.
call npx.cmd vercel --prod
echo.
echo ===============================================================================
echo If this is your first time:
echo 1. It will ask to log in with GitHub / Email.
echo 2. Press Enter to accept the defaults.
echo 3. It will print your permanent production URL!
echo ===============================================================================
pause
