@echo off
setlocal enabledelayedexpansion

:: --- CONFIGURATION ---
set "BASE_URL=https://jurgen.fyi"
set "PAGES_DIR=src\pages"
set "OUTPUT_DIR=public"
set "OUTPUT_FILE=%OUTPUT_DIR%\sitemap.xml"

:: --- EXCLUSION SETTINGS ---
:: Added Socials to exclusions based on your current page list
set "EXCLUDE_LIST=Socials"

:: Create output directory if it doesn't exist
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

:: Generate ISO 8601 Timestamp via PowerShell
for /f "delims=" %%I in ('powershell -command "Get-Date -format 'yyyy-MM-ddTHH:mm:ss.fffZ'"') do set "ISO_DATE=%%I"

:: --- HEADER ---
echo ^<?xml version="1.0" encoding="UTF-8"?^> > "%OUTPUT_FILE%"
echo ^<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"^> >> "%OUTPUT_FILE%"

:: --- 1. FORCE HOME TO BE FIRST ---
echo   ^<url^> >> "%OUTPUT_FILE%"
echo     ^<loc^>%BASE_URL%/^</loc^> >> "%OUTPUT_FILE%"
echo     ^<lastmod^>%ISO_DATE%^</lastmod^> >> "%OUTPUT_FILE%"
echo     ^<priority^>1.0^</priority^> >> "%OUTPUT_FILE%"
echo   ^</url^> >> "%OUTPUT_FILE%"

:: --- 2. LOOP FOR REMAINING PAGES ---
for /f "tokens=*" %%F in ('dir /b /a-d "%PAGES_DIR%"') do (
    set "filename=%%~nF"
    set "skip="

    :: Check against exclusion list AND skip Home since it's already added
    if /I "!filename!"=="Home" set "skip=1"
    for %%E in (%EXCLUDE_LIST%) do (
        if /I "!filename!"=="%%E" set "skip=1"
    )

    if not defined skip (
        :: --- LOWERCASE CONVERSION ALGORITHM ---
        set "slug=!filename!"
        for %%L in (a b c d e f g h i j k l m n o p q r s t u v w x y z) do (
            set "slug=!slug:%%L=%%L!"
        )

        echo   ^<url^> >> "%OUTPUT_FILE%"
        echo     ^<loc^>%BASE_URL%/!slug!^</loc^> >> "%OUTPUT_FILE%"
        echo     ^<lastmod^>%ISO_DATE%^</lastmod^> >> "%OUTPUT_FILE%"
        echo     ^<priority^>0.8^</priority^> >> "%OUTPUT_FILE%"
        echo   ^</url^> >> "%OUTPUT_FILE%"
    )
)

:: --- FOOTER ---
echo ^</urlset^> >> "%OUTPUT_FILE%"

echo Sitemap generated successfully. Closing...
:: 'pause' removed to allow the window to close immediately after execution.
exit