<<<<<<< HEAD
@echo off
setlocal ENABLEDELAYEDEXPANSION

REM $Id: release-deploy.cmd 45 2013-03-08 08:55:45Z ollily $

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
echo D%tgtfolder%D
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
=======
@echo off
setlocal ENABLEDELAYEDEXPANSION

REM $Id: release-deploy.cmd 45 2013-03-08 08:55:45Z ollily $

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
echo D%tgtfolder%D
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
>>>>>>> branch 'master' of https://github.com/ollily/gm-scripting.git
)