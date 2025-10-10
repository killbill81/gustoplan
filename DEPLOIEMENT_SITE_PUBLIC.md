# Guide de Déploiement sur GitHub Pages (Code Privé)

Ce guide explique comment déployer votre application en ligne tout en gardant votre code source dans un dépôt privé.

L'architecture est la suivante :
-   **Un dépôt privé** (ex: `gustoplan`) pour votre code source.
-   **Un dépôt public** (nommé `VOTRE_NOM.github.io`) qui contiendra uniquement le site web final.

---

## Partie 1 : Configuration Initiale (à ne faire qu'une seule fois)

### 1. Préparez vos Dépôts sur GitHub

-   **Dépôt du Code Source (Privé) :**
    -   Assurez-vous que votre dépôt principal (celui contenant le dossier `src`, `package.json`, etc.) est bien sur GitHub. 
    -   Allez dans ses `Settings` -> `Danger Zone` et changez sa visibilité en **Private**. C'est votre coffre-fort.

-   **Dépôt du Site (Public) :**
    -   Créez un **nouveau** dépôt sur GitHub.
    -   **Nommez-le très précisément** en suivant ce format : `VOTRE_NOM.github.io`.
        -   (Dans votre cas : `killbill81.github.io`)
    -   Ce dépôt **doit être Public**.
    -   Vous pouvez y ajouter un fichier README, cela n'a pas d'importance.

### 2. Configurez votre Projet Local

Les modifications suivantes ont déjà été faites, mais voici ce qui a été configuré pour que la magie opère :

-   **`package.json`** : Le script de déploiement a été modifié pour cibler votre dépôt public.
    ```json
    "scripts": {
      "build": "vite build",
      "deploy": "gh-pages -d dist -r https://github.com/killbill81/killbill81.github.io.git -b main"
    }
    ```

-   **`vite.config.js`** : La configuration a été ajustée pour que le site fonctionne à la racine de votre domaine.
    ```javascript
    export default defineConfig({
      base: '/', // Changé pour la racine
      // ...
    });
    ```

---

## Partie 2 : Procédure de Mise en Ligne (à faire à chaque mise à jour)

Chaque fois que vous voulez mettre à jour votre site public, la procédure est simple et se fait en deux commandes depuis votre terminal (à la racine de votre projet `C:\xampp\htdocs\menu\`).

### 1. Construire le Site

Cette commande prend votre code source et génère la version optimisée et "minifiée" de votre site dans le dossier `dist/`.

```bash
npm run build
```

### 2. Déployer le Site

Cette commande prend le contenu du dossier `dist/` et l'envoie sur la branche `main` de votre dépôt public `killbill81.github.io`.

```bash
npm run deploy
```

---


Et c'est tout ! Après avoir lancé `npm run deploy`, attendez une à deux minutes. Votre site sera à jour et visible à l'adresse :

**https://killbill81.github.io/**

N'oubliez pas de sauvegarder votre code source régulièrement sur votre dépôt privé avec `git commit` et `git push`.
