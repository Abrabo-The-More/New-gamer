@echo off
echo ========================================
echo Suhum Senior Technical School
echo School Management System
echo ========================================
echo.

REM ========================================
REM EDIT THESE PATHS TO MATCH YOUR SETUP
REM ========================================

REM Path to WinPython folder (where you extracted WinPython)
set WINPYTHON_PATH=C:\WinPython

REM Path to this project folder
set PROJECT_PATH=C:\School\suhum_sts

REM ========================================
REM DO NOT EDIT BELOW THIS LINE
REM ========================================

echo Checking Python...
"%WINPYTHON_PATH%\python.exe" --version
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please check WINPYTHON_PATH in this file
    pause
    exit /b 1
)

echo.
echo Installing required packages...
"%WINPYTHON_PATH%\python.exe" -m pip install flask pyodbc python-dotenv

echo.
echo Starting application...
cd "%PROJECT_PATH%\app"
"%WINPYTHON_PATH%\python.exe" app.py

pause
