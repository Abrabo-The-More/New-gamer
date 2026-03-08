 @echo off
echo ========================================
echo Suhum Senior Technical School
echo School Management System v2.0
echo ========================================
echo.
echo This script will run the school management system.
echo.
echo IMPORTANT: Place the "suhum_sts" folder next to WinPython folder
echo.
echo Folder structure should be:
echo   C:\School\
echo   ├── WinPython\       (WinPython program)
echo   └── suhum_sts\      (This project)
echo.

REM Get the folder where this batch file is located
set "SCRIPT_DIR=%~dp0"

REM Remove trailing backslash
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

REM Go up one level (from setup folder to main folder)
for %%i in ("%SCRIPT_DIR%") do set "PROJECT_PATH=%%~dpi"
set "PROJECT_PATH=%PROJECT_PATH:~0,-1%"

REM WinPython should be in the same parent folder
set "WINPYTHON_PATH=%PROJECT_PATH%\WinPython"

echo Project Path: %PROJECT_PATH%
echo WinPython Path: %WINPYTHON_PATH%
echo.

REM Check if WinPython exists
if not exist "%WINPYTHON_PATH%\python.exe" (
    echo ERROR: WinPython not found!
    echo.
    echo Please make sure:
    echo 1. WinPython is extracted to a folder named "WinPython"
    echo 2. The "WinPython" folder is next to "suhum_sts" folder
    echo.
    echo Expected path: %WINPYTHON_PATH%
    echo.
    echo See WINPYTHON_SETUP_GUIDE.txt for help.
    pause
    exit /b 1
)

echo Checking Python...
"%WINPYTHON_PATH%\python.exe" --version
echo.

echo Installing required packages...
echo (This may take a few minutes on first run)
"%WINPYTHON_PATH%\python.exe" -m pip install flask pyodbc python-dotenv --quiet

echo.
echo ========================================
echo Starting application...
echo.
echo Open your web browser and go to: http://localhost:5000
echo.
echo LOGIN DETAILS:
echo   Username: admin
echo   Password: admin123
echo   Secret Code: admin2026
echo ========================================
echo.

cd "%PROJECT_PATH%\app"
"%WINPYTHON_PATH%\python.exe" app.py

pause
