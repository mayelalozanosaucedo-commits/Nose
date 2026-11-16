@echo off
cd /d "%~dp0"
echo ============================================
echo       CUBOVERSO ALPHA MULTIJUGADOR
 echo ============================================
 echo.
echo Abre en Chrome: http://localhost:3000
 echo.
echo Para detenerlo presiona Ctrl+C
 echo.
node servidor.js
if errorlevel 1 (
 echo.
 echo No se pudo iniciar el servidor. Instala Node.js (version 18 o posterior).
 pause
)
