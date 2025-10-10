@echo off
echo ==================================================
echo  Sauvegarde de votre travail sur GitHub...
echo ==================================================
echo.

echo --- Etape 1: Ajout de tous les fichiers modifies ---
git add .
echo.

echo --- Etape 2: Message de commit ---
set /p commit_message="Entrez votre message de commit (decrivez vos changements) : "

if "%commit_message%"=="" (
    echo.
    echo Le message de commit ne peut pas etre vide.
    echo Operation annulee.
    pause
    exit /b
)

echo.
echo --- Etape 3: Commit ---
git commit -m "%commit_message%"
echo.

echo --- Etape 4: Push vers GitHub ---
git push origin master
echo.

echo Tache terminee. Appuyez sur une touche pour fermer.
pause > nul
