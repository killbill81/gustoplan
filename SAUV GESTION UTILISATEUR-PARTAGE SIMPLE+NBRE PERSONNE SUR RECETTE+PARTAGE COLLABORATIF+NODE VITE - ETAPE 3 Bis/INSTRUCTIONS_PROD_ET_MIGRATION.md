# Procédures pour la Production et la Migration de l'Environnement de Développement

Ce document explique deux procédures essentielles pour la vie du projet GustoPlan :

1. Comment déployer l'application sur un nouvel environnement de production.
2. Comment installer et continuer le développement sur un nouvel ordinateur.

---

## 

## **1. Mettre l'Application en Production**

L'objectif est de déployer votre application et sa base de données sur un environnement "live" distinct de votre environnement de développement (`gustoplan-dev`).

### 

### Étape A : Création du Projet Firebase de Production

1. **Créer un nouveau projet** : Allez sur la [console Firebase](https://console.firebase.google.com/) et créez un tout nouveau projet. Donnez-lui un nom clair, par exemple `gustoplan-prod`.
2. **Activer Firestore** : Dans votre nouveau projet, allez dans la section "Firestore Database" et créez une base de données.
3. **Copier les Règles de Sécurité** : Allez dans l'onglet "Règles" de Firestore. Copiez les règles de votre projet `gustoplan-dev` et collez-les dans les règles du nouveau projet `gustoplan-prod`. Publiez les modifications.
4. **Créer une Application Web** : Dans les paramètres de votre projet `gustoplan-prod`, créez une nouvelle "Application Web". Firebase vous donnera un nouvel objet de configuration `firebaseConfig`.

### 

### Étape B : Déploiement du Code de l'Application

1. **Mettre à jour la configuration Firebase** : Dans votre code, ouvrez le fichier `src/firebase-config.js`. Remplacez l'objet `firebaseConfig` de développement par le **nouvel** objet fourni par votre projet de production `gustoplan-prod`.
2. **Builder l'application** : Dans votre terminal, à la racine du projet, lancez la commande de build. Cela va créer une version optimisée de votre site dans un dossier `dist/`.

&nbsp;   ```bash
    npm run build
    ```

3. **Déployer sur un hébergeur** : Le contenu du dossier `dist/` est votre site web. Vous pouvez le déployer sur n'importe quel hébergeur web (Netlify, Vercel, Firebase Hosting, un serveur mutualisé, etc.).

### 

### Étape C : Déploiement des Cloud Functions de Production

1. **Cibler le projet de production** : Dans votre terminal, à la racine du projet, tapez la commande suivante pour dire aux outils Firebase de travailler sur votre projet de production :

&nbsp;   ```bash
    firebase use gustoplan-prod
    ```

2. **Déployer les fonctions** : Lancez la même commande de déploiement que précédemment. Elle enverra la fonction sur le bon projet.

&nbsp;   ```bash
    firebase deploy --only functions
    ```

---

## 

## **2. Continuer le Développement sur un Autre PC**

L'objectif est de cloner votre environnement de travail sur une nouvelle machine.

### 

### Prérequis

Assurez-vous que les logiciels suivants sont installés sur le nouvel ordinateur :

* **Node.js** (qui inclut npm)
* **Git** (si vous utilisez le versioning, ce qui est fortement recommandé)

### 

### Étapes d'Installation

1. **Copier les fichiers du projet** : Transférez l'intégralité de votre dossier de projet (`C:\\xampp\\htdocs\\menu`) sur le nouvel ordinateur via une clé USB, un service cloud, ou en clonant votre dépôt Git.
2. **Ouvrir un terminal** : Sur le nouvel ordinateur, ouvrez un terminal et naviguez jusqu'au dossier du projet que vous venez de copier.
3. **Installer les dépendances du projet** : Cette commande lit votre fichier `package.json` et télécharge toutes les bibliothèques nécessaires (`vite`, `firebase`, `firebase-admin`, etc.) dans un dossier `node\_modules`.

&nbsp;   ```bash
    npm install
    ```

4. **Installer les outils Firebase (si nécessaire)** : Si ce n'est pas déjà fait sur cette machine, installez les outils Firebase globalement.

&nbsp;   ```bash
    npm install -g firebase-tools
    ```

5. **Se connecter à Firebase** : Connectez le nouvel ordinateur à votre compte Firebase.

&nbsp;   ```bash
    firebase login
    ```

### 

### Fichiers importants à ne pas oublier

Lors de la copie, assurez-vous de bien inclure le fichier de clé de service que vous avez généré. **Attention, ce fichier est sensible.**

* `NETTOYAGE TABLES  + SAUV BDD COMPLETE/service-account-key.json`

Une fois ces étapes terminées, votre nouvel environnement est prêt. Vous pouvez lancer le serveur de développement comme d'habitude avec `npm run dev`.

