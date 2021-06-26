set MODULE_NAME=grab_links
set SRC_DIR=%~dp0\tpl
set TARGET_NAME=%MODULE_NAME%.user.js

set DEPLOY_FOLDER=%MODULE_NAME%
rem set DEPLOY_NAME=82191.user.js

rem set C1=%COMMON_DIR%\gm_base.user.js.RAW.js
set C2=%TOOLS_DIR%\gm4-polyfill.user.js.RAW.js

set P1=%FILE_PREFIX%%MODULE_NAME%.js
set P2=%SRC_DIR%\gl-style.user.js