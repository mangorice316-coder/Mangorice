@echo off
echo ============================================================
echo   ASTRA 3D: Opening Full 3D Real Space Station in Unity 6...
echo ============================================================
set "UNITY_PATH=C:\Program Files\Unity\Hub\Editor\6000.5.2f1\Editor\Unity.exe"
set "PROJECT_PATH=%~dp0UnityProject"

if exist "%UNITY_PATH%" (
    echo Launching Unity Editor with 3D Space Station & NASA Cadet...
    start "" "%UNITY_PATH%" -projectPath "%PROJECT_PATH%"
) else (
    echo Unity Editor not found at default path. Launching via Unity Hub...
    start "" "C:\Program Files\Unity Hub\Unity Hub.exe"
)
exit
