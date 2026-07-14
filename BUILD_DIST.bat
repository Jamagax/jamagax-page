@echo off
echo [BUILD] Cleaning dist folder...
if exist dist rmdir /s /q dist
mkdir dist
mkdir dist\assets
mkdir dist\jamagax_models

echo [BUILD] Copying core files...
copy /Y index.html dist\
copy /Y style.css dist\
copy /Y app.js dist\
copy /Y robots.txt dist\
copy /Y sitemap.xml dist\

echo [BUILD] Copying assets...
xcopy /E /I /Y assets dist\assets
xcopy /E /I /Y jamagax_models dist\jamagax_models

echo [BUILD] Success! dist/ folder is ready for FTP upload.
