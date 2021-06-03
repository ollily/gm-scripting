@echo off
setlocal ENABLEDELAYEDEXPANSION


set BASE=%~dp0
set PRF=tpl_
set TPL_BASE=tpl

set GM_COMMON=%BASE%\gm_base\%TPL_BASE%

set gmdir=%cd%
if "%~1" NEQ "" (
    set gmdir=%~dpn1
)

if "%~2" NEQ "" (
    set tgtroot=%~f2
)

set benv=%gmdir%\build_env.cmd
if exist "%benv%" (
    call "%benv%"
) else (
    echo settings mising "%bbenv%"
    exit /B 12
)

set bbuild=%BASE%\release-build.cmd
echo.
echo now deploying
echo   "%tgtfolder%"
echo.
if exist "%bbuild%" (
    call "%bbuild%"
) else (
    echo buildscript mising "%bbuild%"
    exit /B 12
)

if "%tgtroot%" NEQ "" (
    if "%tgtfolder%" NEQ "" (
        if exist "%tgtroot%\%tgtfolder%" (
            set gmfile2=%gmdir%\%gmname2%
            set tgtfile=%tgtroot%\%tgtfolder%\%tgtname%
            move /Y "!gmfile2!" "!tgtfile!"
        ) else (
            echo targetfolder missing "%tgtroot%\%tgtfolder%"
        )
    ) else (
        echo targetfolder not set "%tgtfolder%"
        )
) else (
    echo targetroot missing "%tgtroot%"
)
