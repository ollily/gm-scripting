@echo off
setlocal ENABLEDELAYEDEXPANSION

set MODULE_DIR=%cd%
if "%~1" NEQ "" set MODULE_DIR=%~dpn1

REM -----
REM common settings
REM -----
set BASE_DIR=%~dp0
set FILE_PREFIX=tpl_
set SRC_BASE_NAME=tpl
set COMMON_DIR=%BASE_DIR%\gm_base
set TOOLS_DIR=%BASE_DIR%\gm_tools
set RAW_EXT=.RAW.js
if "%RAW%x" EQU "x" set RAW=0

set HE1=%FILE_PREFIX%head1.js
set VE1=%FILE_PREFIX%version.js
set HE2=%FILE_PREFIX%head2.js
set FO1=%FILE_PREFIX%footer1.js
set FO2=%FILE_PREFIX%footer2.js

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
set TARGET_FILE=%MODULE_DIR%\%TARGET_NAME%
if "%RAW%x" EQU "1x" (
	set TARGET_FILE=%MODULE_DIR%\%TARGET_NAME%%RAW_EXT%
)
if "%SRC_DIR%x" EQU "x" (
	set SRC_DIR=%MODULE_DIR%\%SRC_BASE_NAME%
)
if "%MODULE_NAME%x" EQU "x" (
	echo MODULE_NAME is missing
	exit /B 120
) 
if not exist "%MODULE_DIR%" (
    echo "%MODULE_DIR%" not exists
    exit /B 121
)
if not exist "%SRC_DIR%" (
    echo "%SRC_DIR%" not exists
    exit /B 122
)

REM -----
REM Build the target file
REM -----
echo.
echo now building       : %MODULE_NAME% - "%TARGET_FILE%"
echo.
if exist "%TARGET_FILE%" (
	echo backup current     : "%TARGET_FILE%"
	echo   to               : "%TARGET_FILE%.prev"
	move /Y "%TARGET_FILE%" "%TARGET_FILE%.prev"
)

REM -----
REM Define the header
REM -----
if "%RAW%x" EQU "0x" (
	if exist "%SRC_DIR%\%HE1%" (type "%SRC_DIR%\%HE1%">"%TARGET_FILE%")
	if exist "%SRC_DIR%\%VE1%" (type "%SRC_DIR%\%VE1%">>"%TARGET_FILE%")
	if exist "%SRC_DIR%\%HE2%" (type "%SRC_DIR%\%HE2%">>"%TARGET_FILE%")
)

REM -----
REM Define the common files
REM -----
if "%RAW%x" EQU "0x" (
	if "%C1%x" NEQ "x" (
		echo.>>"%TARGET_FILE%"
		echo //>>"%TARGET_FILE%"
		echo // Global Code - START>>"%TARGET_FILE%"
		echo //>>"%TARGET_FILE%"
		echo.>>"%TARGET_FILE%"
	)
)
for %%I in (1,2,3,4,5,6,7,8,9) do if "!C%%I!" NEQ "" (
    if exist "%SRC_DIR%\!C%%I!" (
        type "%SRC_DIR%\!C%%I!">>"%TARGET_FILE%"
    ) else (
        if exist "!C%%I!" (
            type "!C%%I!">>"%TARGET_FILE%"
        ) else (
            echo NOT found : !C%%I!
		    exit 130
        )
    )
)
if "%RAW%x" EQU "0x" (
	if "%C1%x" NEQ "x" (
		echo.>>"%TARGET_FILE%"
		echo //>>"%TARGET_FILE%"
		echo // Global Code - END>>"%TARGET_FILE%"
		echo //>>"%TARGET_FILE%"
		echo.>>"%TARGET_FILE%"
	)
)
REM -----
REM Define the content
REM -----
if "%RAW%x" EQU "0x" (
	if "%P1%x" NEQ "x" (
		echo.>>"%TARGET_FILE%"
		echo //>>"%TARGET_FILE%"
		echo //GM-Script specific code - START>>"%TARGET_FILE%"
		echo //>>"%TARGET_FILE%"
		echo.>>"%TARGET_FILE%"
	)
)
for %%I in (1,2,3,4,5,6,7,8,9) do if "!P%%I!" NEQ "" (
    if exist "%SRC_DIR%\!P%%I!" (
        type "%SRC_DIR%\!P%%I!">>"%TARGET_FILE%"
    ) else (
        if exist "!P%%I!" (
            type "!P%%I!">>"%TARGET_FILE%"
        ) else (
            echo NOT found : !P%%I!
		    exit 131
        )
    )
)
if "%RAW%x" EQU "0x" (
	if "%P1%x" NEQ "x" (
		echo.>>"%TARGET_FILE%"
		echo //>>"%TARGET_FILE%"
		echo //GM-Script specific code - END>>"%TARGET_FILE%"
		echo //>>"%TARGET_FILE%"
		echo.>>"%TARGET_FILE%"
	)
)

REM -----
REM Define the footer
REM -----
if exist "%SRC_DIR%\%FO1%" (type "%SRC_DIR%\%FO1%">>"%TARGET_FILE%")
if exist "%SRC_DIR%\%FO2%" (type "%SRC_DIR%\%FO2%">>"%TARGET_FILE%")

if "%RAW%x" EQU "0x" (
	echo.>>"%TARGET_FILE%"
	echo //>>"%TARGET_FILE%"
	echo //GM-Script - END>>"%TARGET_FILE%"
	echo //>>"%TARGET_FILE%"
	echo.>>"%TARGET_FILE%"
)

REM -----
REM deploy file to browser target folder
REM -----
if "%DEPLOY_NAME%x" NEQ "x" (
	set TARGET_FILE2=%MODULE_DIR%\%DEPLOY_NAME%
)
if "%TARGET_FILE2%x" NEQ "x" (
    echo deploy from : "%TARGET_FILE%"
    echo   to        : "%TARGET_FILE2%"
    if exist "%TARGET_FILE2%" (rm "%TARGET_FILE2%")
    copy /Y "%TARGET_FILE%" "%TARGET_FILE2%"
)

echo.
echo finished building  : "%TARGET_FILE%"
echo.

endlocal
