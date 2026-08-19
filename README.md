# 🍳 Gustoplan — Planificateur de Repas & Liste de Courses Intelligente

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

> **Gustoplan** est une application web progressive (PWA) moderne conçue pour simplifier la gestion des repas du foyer. Elle permet de planifier visuellement la semaine, d'adapter le nombre de convives en temps réel et de générer automatiquement une liste de courses collaborative et triée par rayon.

🔗 **Démo en ligne** : [https://gustoplan-dev.web.app](https://gustoplan-dev.web.app)

---

## 🌟 Fonctionnalités Clés

### 📅 1. Planning Hebdomadaire Drag & Drop
- **Glisser-Déposer intuitif** : Planification rapide des repas (midi & soir) par glisser-déposer sur une grille hebdomadaire réactive (`@dnd-kit`).
- **Ajustement dynamique des portions** : Réglage instantané du nombre de personnes par repas (ex: 3P, 5P).
- **Cartes visuelles** : Aperçu de l'état des ingrédients (présents/manquants) via des puces de couleur vert/rouge.

### 🛒 2. Moteur de Génération de Liste de Courses (`courseEngine.ts`)
- **Calcul automatique des quantités** : Les ingrédients des recettes sont automatiquement agrégés et ajustés en fonction du nombre de portions configuré dans le planning.
- **Tri intelligent par rayons de supermarché** : Classement automatique par catégorie (*Fruits & Légumes*, *Boucherie*, *Frais & Crèmerie*, *Épicerie*, etc.).
- **Ordre déterministe et stable** : Algorithme évitant tout saut visuel de catégorie lors du coche des articles.
- **Détails de provenance** : Chaque ingrédient indique la recette et le jour concernés ainsi que le nombre de convives `(ex: 5P)`.

### 👥 3. Collaboration Temps Réel Multi-Membres (Foyer)
- **Synchronisation Firestore (`onSnapshot`)** : Toutes les modifications (planning, liste de courses, ajout d'ingrédient) sont répercutées instantanément sur tous les appareils des membres du même foyer.
- **Système de code d'invitation** : Création ou rejointement facile d'un foyer partagé.

### ↩️ 4. Système d'Annulation Global (Undo/Redo)
- **Bouton persistant contextuel** : Bouton flottant de retour en arrière permettant d'annuler les suppressions ou réinitialisations accidentelles (planning, recettes, éléments de liste).

### 📖 5. Gestionnaire de Recettes & Ingrédients
- **Éditeur modulaire réutilisable (`RecipeEditModal`)** : Création et modification de recettes avec auto-complétion intelligente des ingrédients et des unités.
- **Base d'ingrédients personnalisée** : Possibilité de créer des ingrédients et d'assigner des rayons personnalisés.

---

## 🛠️ Stack Technique & Architecture

### **Frontend**
- **Framework** : React 18 (Hooks, Context API, Architecture composants modulaires)
- **Langage** : TypeScript (Typage strict des interfaces domaine : `Recette`, `PlanningSemaine`, `ElementListeCourses`, `ElementSourceRecette`)
- **Build Tool** : Vite (HMR ultra-rapide, bundling optimisé)
- **Styling** : Tailwind CSS v4 + animations CSS modernes
- **Drag & Drop** : `@dnd-kit/core` & `@dnd-kit/sortable` (Contraintes d'activation PointerSensor & TouchSensor pour mobile)
- **Iconographie** : Lucide React

### **Backend & Cloud Services**
- **Database** : Firebase Firestore (Base NoSQL temps réel avec règles de sécurité par foyer)
- **Authentication** : Firebase Auth (Email/Mot de passe, gestion de session)
- **Hosting** : Firebase Hosting (SSL, CDN global)

---

## 📐 Architecture du Projet

```text
gustoplan-v2/
├── src/
│   ├── components/         # Composants UI modulaires
│   │   ├── PlanningView.tsx   # Vue principale du planning & Drag & Drop
│   │   ├── ListeView.tsx      # Gestion de la liste de courses & export
│   │   ├── RecettesView.tsx   # Catalogue et grille des recettes
│   │   ├── RecipeEditModal.tsx# Formulaire d'édition modale réutilisable
│   │   ├── IngredientsView.tsx# Gestion de la base globale d'ingrédients & rayons
│   │   └── AuthScreen.tsx     # Écran de connexion & gestion du foyer
│   ├── contexts/          # Gestion des états globaux (AuthContext, Toast)
│   ├── services/          # Logique métier et requêtes réseau
│   │   ├── db.ts             # Services Firestore (Abonnements & Mutateurs)
│   │   └── courseEngine.ts   # Moteur d'agrégation et de calcul de la liste
│   ├── types/             # Modèles TypeScript du domaine
│   └── App.tsx            # Composant racine et routage par onglets
├── public/                # Assets statiques & icônes
├── firebase.json          # Configuration Firebase Hosting & Firestore
└── vite.config.js         # Configuration Vite
```

---

## ⚡ Highlights Ingénierie & Choix Développeur

- **Découplage & Modularité** : Isolation du moteur d'agrégation des courses (`courseEngine.ts`) de l'interface utilisateur pour faciliter les tests unitaires.
- **UX Mobile & Tactile** : Ajustement fin des capteurs `@dnd-kit` pour différencier le scroll tactile du glisser-déposer d'éléments.
- **Résolution des Problèmes de Rendement UI** : Implémentation d'un hachage personnalisé des collections pour éviter les re-rendus et écritures Firebase inutiles lors du recalcul de la liste.
- **Accessibilité & Design System** : Palette de couleurs soigneusement définie par rayon pour une lisibilité immédiate en magasin.

---

## 🚀 Installation & Lancement en Local

### Prérequis
- **Node.js** (v18+)
- **npm** (v9+)

### 1. Cloner le projet
```bash
git clone https://github.com/killbill81/gustoplan.git
cd gustoplan/gustoplan-v2
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

### 4. Compiler pour la production
```bash
npm run build
```

---

## 📄 Licence

Projet développé par **Jean-Philippe (killbill81)** — Développeur Web Front-End / Full-Stack.  
Distribué sous licence MIT.
