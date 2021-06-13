@echo off
setlocal ENABLEDELAYEDEXPANSION

REM -----
REM common settings
REM -----
set BASE_DIR=%~dp0
set FILE_PREFIX=tpl_
set SRC_DIR=tpl
set COMMON_DIR=%BASE_DIR%\gm_base
set TOOLS_DIR=%BASE_DIR%\gm_tools

set MODULE_DIR=%cd%
if "%~1" NEQ "" (
    set MODULE_DIR=%~dpn1
)
if "%~2" NEQ "" (
    set DEPLOY_ROOT=%~f2
)

REM -----
REM get script specific settings
REM -----
set ENV_FILE=%MODULE_DIR%\build_env.cmd
if exist "%ENV_FILE%" (
    call "%ENV_FILE%"
) else (
    echo settings mising "%ENV_FILE%"
    exit /B 110
)

REM -----
REM check requirements
REM -----
if "%MODULE_NAME%x" EQU "x" (
	echo MODULE_NAME is missing
	exit /B 120
) 
if not exist "%MODULE_DIR%" (
    echo "%MODULE_DIR%" not exists
    exit /B 121
)

REM -----
REM Build the target file
REM -----
set BUILD_SCRIPT=%BASE_DIR%\release-build.cmd
echo.
echo now deploying %MODULE_NAME% - "%DEPLOY_FOLDER%"
echo.
if exist "%BUILD_SCRIPT%" (
    call "%BUILD_SCRIPT%"
) else (
    echo buildscript mising "%BUILD_SCRIPT%"
    exit /B 210
)

if "%DEPLOY_ROOT%" NEQ "" (
    if "%DEPLOY_FOLDER%" NEQ "" (
        if exist "%DEPLOY_ROOT%\%DEPLOY_FOLDER%" (
            set TARGET_FILE2=%MODULE_DIR%\%TARGET_NAME2%
            set DEPLOY_FILE=%DEPLOY_ROOT%\%DEPLOY_FOLDER%\%DEPLOY_NAME%
            move /Y "!TARGET_FILE2!" "!DEPLOY_FILE!"
        ) else (
            echo targetfolder missing "%DEPLOY_ROOT%\%DEPLOY_FOLDER%"
        )
    ) else (
        echo targetfolder not set "%DEPLOY_FOLDER%"
        )
) else (
    echo targetroot missing "%DEPLOY_ROOT%"
)

echo finished deploying  : "%DEPLOY_FOLDER%"
echo.

endlocal
