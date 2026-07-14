@echo off
echo ===================================================
echo 🌀 JAMAGAX STUDIO - SERVIDOr LOCAL DE MODELOS 3D 
echo ===================================================
echo.
echo Iniciando servidor local en el puerto 8000...
echo Abriendo navegador en http://127.0.0.1:8000
echo.
echo (Para detener el servidor, cierra esta ventana de comandos)
echo ===================================================
echo.

start "" "http://127.0.0.1:8000"
python -m http.server 8000 --bind 127.0.0.1
