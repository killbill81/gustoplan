# Guide de Déploiement avec GitHub et GitHub Pages

Ce document contient les instructions pour deux opérations : 
1.  La configuration initiale de votre projet avec GitHub.
2.  La procédure à suivre pour chaque mise à jour de votre site en ligne.

---

## Partie 1 : Configuration Initiale (à ne faire qu'une seule fois)

L'objectif est de mettre votre code source sur GitHub et de le préparer pour le déploiement.

### 1. Créer le Dépôt sur GitHub

-   Allez sur [GitHub](https://github.com) et créez un **nouveau dépôt**. 
-   Nommez-le (par exemple, `gustoplan`).
-   **Ne cochez aucune case** (pas de README, pas de .gitignore, etc.).
-   Cliquez sur "Create repository".
-   Gardez la page ouverte, vous aurez besoin des commandes qui s'affichent.

### 2. Connecter votre Projet Local

Ouvrez un terminal à la racine de votre projet (`C:\xampp\htdocs\menu\`).

```bash
# Initialise Git dans votre dossier (si ce n'est pas déjà fait)
git init

# Ajoute tous les fichiers pour le suivi
git add .

# Crée une "photographie" de votre projet
git commit -m "Initial commit"

# Connecte votre dossier local au dépôt GitHub distant
# (Remplacez l'URL par celle fournie par GitHub)
git remote add origin https://github.com/VOTRE_NOM/gustoplan.git

# Pousse votre code sur GitHub
git push -u origin master
```

### 3. Configurer le Déploiement Automatisé

Ces commandes préparent votre projet pour qu'il puisse être déployé facilement.

```bash
# Installe l'outil de déploiement pour GitHub Pages
npm install gh-pages --save-dev
```

Ensuite, assurez-vous que les fichiers suivants sont correctement configurés (je l'ai déjà fait pour vous, c'est juste pour référence) :

-   **`package.json`** doit contenir :
    ```json
    {
      "homepage": "https://VOTRE_NOM.github.io/gustoplan",
      "scripts": {
        "build": "vite build",
        "deploy": "gh-pages -d dist"
      }
    }
    ```
    *(N'oubliez pas de remplacer `VOTRE_NOM` et `gustoplan`)*

-   **`vite.config.js`** doit contenir la base :
    ```javascript
    import { defineConfig } from 'vite';

    export default defineConfig({
      base: '/gustoplan/',
      // ... reste de la configuration
    });
    ```
    *(N'oubliez pas de remplacer `/gustoplan/` si le nom de votre dépôt est différent)*

-   **`.gitignore`** doit contenir la ligne `/dist` pour ignorer le dossier de production.

---

## Partie 2 : Procédure de Mise en Production (à faire à chaque mise à jour)

Chaque fois que vous avez terminé une nouvelle fonctionnalité ou une correction et que vous voulez la mettre en ligne sur votre site GitHub Pages.

### 1. Sauvegarder votre Code Source

C'est la première chose à faire. Dans votre terminal :

```bash
# Ajoute les fichiers que vous avez modifiés
git add .

# Crée une nouvelle "photographie" avec un message descriptif
git commit -m "Ajout de la fonctionnalité X" 

# Pousse vos modifications sur GitHub
git push
```

### 2. Déployer sur GitHub Pages

Cette procédure se fait en deux commandes simples :

```bash
# 1. Construit la version optimisée de votre site dans le dossier /dist
npm run build

# 2. Envoie le contenu du dossier /dist sur la branche gh-pages de GitHub
npm run deploy
```

Attendez une à deux minutes, et votre site en ligne sera à jour avec vos dernières modifications.

```