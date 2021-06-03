@echo off
setlocal ENABLEDELAYEDEXPANSION


REM -----
REM common settings

set BASE=%~dp0
set PRF=tpl_
set TPL_BASE=tpl

set GM_COMMON=%BASE%\gm_base\%TPL_BASE%

set gmdir=%cd%
if "%~1" NEQ "" (
    set gmdir=%~dpn1
)

set benv=%gmdir%\build_env.cmd

set HE1=%PRF%head1.js
set VE1=%PRF%version.js
set HE2=%PRF%head2.js
set FO1=%PRF%footer1.js
set FO2=%PRF%footer2.js

REM -----
REM get script specific settings

if exist "%benv%" (
    call "%benv%"
) else (
    echo settings mising "%bbenv%"
    exit /B 12
)

REM -----
REM check requirements

set gmfile=%gmdir%\%gmname%
if "%gmname2%" NEQ "" set gmfile2=%gmdir%\%gmname2%

if "%tpldir%" EQU "" (
    set tpldir=%gmdir%\%TPL_BASE%
)

if not exist "%gmdir%" (
    echo "%gmdir%" not exists
    exit /B 10
)
if not exist "%tpldir%" (
    echo "%tpldir%" not exists
    exit /B 11
)

echo.
echo now building
echo   "%gmfile%"
echo.

REM -----
REM Define the header

if exist "%tpldir%\%HE1%" (type "%tpldir%\%HE1%">"%gmfile%")
if exist "%tpldir%\%VE1%" (type "%tpldir%\%VE1%">>"%gmfile%")
if exist "%tpldir%\%HE2%" (type "%tpldir%\%HE2%">>"%gmfile%")

REM -----
REM Define the common files

echo.>>"%gmfile%"
echo //>>"%gmfile%"
echo // Global Code - START>>"%gmfile%"
echo //>>"%gmfile%"
echo.>>"%gmfile%"

for %%I in (1,2,3,4,5,6,7,8,9) do if "!C%%I!" NEQ "" (
    if exist "%tpldir%\!C%%I!" (
        type "%tpldir%\!C%%I!">>"%gmfile%"
    ) else (
        if exist "!C%%I!" (
            type "!C%%I!">>"%gmfile%"
        ) else (
            echo NOT found : !C%%I!
        )
    )
)

echo.>>"%gmfile%"
echo //>>"%gmfile%"
echo // Global Code - END>>"%gmfile%"
echo //>>"%gmfile%"
echo.>>"%gmfile%"

REM -----
REM Define the content

echo.>>"%gmfile%"
echo //>>"%gmfile%"
echo //GM-Script specific code - START>>"%gmfile%"
echo //>>"%gmfile%"
echo.>>"%gmfile%"

for %%I in (1,2,3,4,5,6,7,8,9) do if "!P%%I!" NEQ "" (
    if exist "%tpldir%\!P%%I!" (
        type "%tpldir%\!P%%I!">>"%gmfile%"
    ) else (
        if exist "!P%%I!" (
            type "!P%%I!">>"%gmfile%"
        ) else (
            echo NOT found : !P%%I!
        )
    )
)

echo.>>"%gmfile%"
echo //>>"%gmfile%"
echo //GM-Script specific code - END>>"%gmfile%"
echo //>>"%gmfile%"
echo.>>"%gmfile%"

REM -----
REM Define the footer

if exist "%tpldir%\%FO1%" (type "%tpldir%\%FO1%">>"%gmfile%")
if exist "%tpldir%\%FO2%" (type "%tpldir%\%FO2%">>"%gmfile%")

REM -----
REM copy file to browser target folder

if "%gmfile2%" NEQ "" (
    echo copy from   : "%gmfile%"
    echo deploy-file : "%gmfile2%"
    if exist "%gmfile2%" (rm "%gmfile2%")
    copy /Y "%gmfile%" "%gmfile2%"
)

echo.
echo finished building
echo   "%gmfile%"
echo.

endlocal
