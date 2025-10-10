@echo off
echo ==================================================
echo  Recuperation des dernieres modifications depuis GitHub...
echo ==================================================
echo.

git pull origin master

echo.
echo Tache terminee. Appuyez sur une touche pour fermer.
pause > nul
