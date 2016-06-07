@echo off

WHERE /q node

IF ERRORLEVEL 1 (

    ECHO Node must be installed. Download it at https://nodejs.org.
    EXIT /B

) ELSE (

    cd /d %~dp0

    IF NOT EXIST node_modules (

    	npm install

    )

    node .

)