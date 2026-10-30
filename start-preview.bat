@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo Node.js is required. Install Node.js 18 or newer from https://nodejs.org/
  echo Then double-click this file again.
  pause
  exit /b 1
)
echo.
echo Starting ProRack Move local MVP...
echo Open http://localhost:5173 in your browser.
echo Press Ctrl+C in this window to stop the preview.
echo.
node server.mjs
pause
