@echo off
setlocal
cd /d "%~dp0"

title Idle RPG 2D

echo.
echo ==========================================
echo          IDLE RPG 2D - STARTING
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed or is not in PATH.
    echo.
    echo Install Node.js LTS and run this file again.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing dependencies for the first run...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
)

echo Starting the game...
echo Your browser will open automatically.
echo Keep this window open while playing.
echo.

call npm run dev -- --open

echo.
echo The game server has stopped.
pause
