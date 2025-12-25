@echo off
echo [BUILD] Cleaning dist folder...
if exist dist rmdir /s /q dist
mkdir dist
mkdir dist\assets

echo [BUILD] Copying core files...
copy /Y index.html dist\
copy /Y style.css dist\
copy /Y script.js dist\

echo [BUILD] Copying assets...
xcopy /E /I /Y assets dist\assets

echo [BUILD] Success! dist/ folder is ready for FTP upload.
