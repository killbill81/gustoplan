@echo off
echo ==================================================
echo  1. Construction du projet (npm run build)
echo ==================================================
echo.

npm run build

echo.
echo ==================================================
echo  2. Deploiement sur GitHub Pages...
echo ==================================================
echo.

npm run deploy

echo.
echo --- Tache terminee ---
echo Le site devrait etre en ligne sur votre page GitHub dans quelques instants.
echo.

pause
