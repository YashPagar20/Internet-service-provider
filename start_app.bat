@echo off
echo Starting ISP Automation System (Dockerized)...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running or not accessible. Please start Docker Desktop and try again.
    pause
    exit /b
)

echo Building and starting all services (Database, Backend, Frontend)...
docker-compose up -d --build

if %errorlevel% neq 0 (
    echo Failed to start services. Please check the logs.
    pause
    exit /b
)

echo.
echo Application started successfully!
echo Backend API : http://localhost:8080
echo Frontend UI : http://localhost:3000
echo Database    : localhost:5432
echo.
echo Logs are being streamed below (Press Ctrl+C to stop logs, services will keep running)...
docker-compose logs -f
pause
