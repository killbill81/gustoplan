### **Rapport sur l'Expérience Utilisateur (UI/UX) de l'Application GustoPlan**

Ce document a pour but de décrire l'interface utilisateur actuelle de l'application GustoPlan et de proposer des axes d'amélioration pour rendre l'expérience plus agréable, intuitive et moderne.

### **1. Analyse de l'Environnement UI Actuel**

L'application est une **Single Page Application (SPA)** développée en JavaScript natif, s'appuyant sur une architecture de routage personnalisée. Le style est géré par le framework **Tailwind CSS**, enrichi d'une feuille de style personnalisée (`style.css`) qui définit une identité visuelle propre.

**a. Identité Visuelle et Technique**

*   **Palette de couleurs :** L'identité est chaleureuse et "gourmande", avec des couleurs principales comme `Sienna` (tomate), `Sage Green` (avocat), et `Rose Taupe` (aubergine). Le fond général est une couleur crème (`Old Lace`), ce qui est doux et agréable.
*   **Typographie :** L'utilisation de 'Quicksand' pour les titres et 'Open Sans' pour le corps du texte offre un bon équilibre entre modernité et lisibilité.
*   **Frameworks :** L'usage de Tailwind CSS est un excellent choix pour une approche "utility-first", mais il est complété par beaucoup de classes CSS personnalisées, ce qui peut parfois créer des doublons ou des incohérences.
*   **Interactivité :** L'interface est riche : multiples modales pour les actions (création, édition, partage), système de notifications, drag-and-drop pour les repas, et une fonctionnalité de mode sombre.

**b. Analyse par Page (Routes)**

1.  **Page de Connexion (`login.html`)**
    *   **UI :** Très simple et efficace. Elle utilise le widget `FirebaseUI` qui est une solution standard et robuste. La page est centrée, claire et va droit au but.
    *   **Parcours :** L'utilisateur se connecte et est redirigé vers la page principale (`index.html`).

2.  **Tableau de Bord Principal (Route: `/menu`)**
    *   **UI :** C'est la page la plus dense et le cœur de l'application. Elle est divisée en deux colonnes sur grand écran :
        *   **Colonne de gauche (80%) :** Le planificateur de repas hebdomadaire. Il présente une grille complexe avec les jours, les moments (midi/soir), et les types de plat (entrée, plat, etc.). Il inclut une navigation par semaine, un sélecteur de "plan" (planning), et de nombreux boutons d'action (Générer par IA, Vider, Exporter, Partager, Sauvegarder).
        *   **Colonne de droite (20%) :** La liste de courses, qui se met à jour dynamiquement. Elle possède ses propres actions (Importer, Exporter).
    *   **Complexité :** La densité d'informations et d'actions sur cette page est très élevée.

3.  **Mes Recettes (Route: `/recipes`)**
    *   **UI :** Une page de gestion classique avec une barre de recherche, des onglets pour filtrer par catégorie (Entrée, Plat, etc.), et une liste de recettes. L'ajout et la modification se font via une modale complexe.

4.  **Mes Ingrédients (Route: `/ingredients`)**
    *   **UI :** Similaire à la page des recettes, avec une gestion par catégories et une modale pour l'ajout/modification.

5.  **Mes Listes (Route: `/lists`)**
    *   **UI :** Affiche les listes de courses sauvegardées sous forme de cartes, permettant de les visualiser ou de les modifier.

6.  **Amis & Partages (Routes: `/friends`, `/shared`)**
    *   **UI :** Ces sections gèrent l'aspect social. L'interface permet de chercher des amis, gérer les demandes, et voir l'historique des contenus partagés (plans, listes).

7.  **Navigation**
    *   **Desktop :** Une barre de navigation supérieure fixe (`header`) contient tous les liens vers les sections, les notifications et le profil.
    *   **Mobile :** Une barre de navigation inférieure apparaît, offrant un accès rapide aux 4 fonctionnalités jugées principales (Accueil, Planning, Courses, IA). C'est une excellente pratique pour l'ergonomie mobile.

---

### **2. Préconisations d'Améliorations UI/UX**

L'application est fonctionnellement très riche. Les améliorations suivantes visent à la rendre plus "respirante", intuitive et agréable sur le long terme.

**a. Cohérence et Design System**

*   **Problème :** Le mélange de classes Tailwind et de CSS personnalisé (`.btn`, `.meal-card`) peut rendre la maintenance difficile et créer des incohérences.
*   **Préconisation :**
    1.  **Intégrer les couleurs et polices dans Tailwind :** Déplacez vos variables de couleurs (`--tomato`, etc.) et vos polices (`Quicksand`) dans le fichier `tailwind.config.js`.
        ```javascript
        // tailwind.config.js
        theme: {
          extend: {
            colors: {
              tomato: '#A0522D',
              avocado: '#8F9779',
              // ...etc
            },
            fontFamily: {
              sans: ['Open Sans', 'sans-serif'],
              display: ['Quicksand', 'sans-serif'],
            }
          }
        }
        ```
    2.  **Utilisation :** Vous pourrez alors utiliser des classes comme `bg-tomato`, `text-avocado`, `font-display` directement dans votre HTML, réduisant le besoin de CSS personnalisé et garantissant une cohérence parfaite.

**b. Expérience Mobile du Planificateur**

*   **Problème :** La grille de planification est conçue pour de grands écrans (`min-w-[1400px]`) et force un défilement horizontal pénible sur mobile.
*   **Préconisation :**
    1.  **Repenser la grille pour mobile :** Abandonnez la grille horizontale. Adoptez une vue verticale, par jour.
    2.  **Pattern "Accordéon" :** Affichez la semaine comme une liste de jours (Lundi, Mardi, ...). Chaque jour est un "accordéon" cliquable. En cliquant sur un jour, il se déplie pour révéler les cases "Midi" et "Soir". C'est une approche standard et très efficace sur mobile pour gérer des données complexes.

**c. Clarté et Hiérarchie Visuelle du Tableau de Bord**

*   **Problème :** La page principale contient trop de groupes d'actions sans séparation visuelle claire, ce qui peut submerger l'utilisateur.
*   **Préconisation :**
    1.  **Regrouper logiquement :** Encadrez les groupes d'actions dans des cartes distinctes. Par exemple, le sélecteur de plan et les boutons associés (renommer, supprimer, partager) pourraient être dans une carte avec un titre "Gestion du Plan".
    2.  **Utiliser des séparateurs :** De simples lignes (`<hr>`) ou des variations de fond (`bg-gray-50`) peuvent aider à délimiter visuellement la navigation de la semaine, la gestion du plan et les actions globales.

**d. Feedback Utilisateur et "Jus" d'Interface**

*   **Problème :** L'application utilise déjà un spinner de chargement, ce qui est bien. Cependant, les interactions pourraient être plus gratifiantes.
*   **Préconisation :**
    1.  **Remplacer les `alert()` :** Si des `alert()` ou `confirm()` JavaScript sont utilisés, remplacez-les systématiquement par vos modales stylisées (`#delete-confirm-modal`) pour une expérience intégrée.
    2.  **Micro-interactions :** Ajoutez de subtiles animations. Quand un repas est ajouté, il pourrait apparaître avec un léger effet de "fondu". Quand un item est ajouté à la liste de courses, il pourrait brièvement se surligner. Ces détails rendent l'application plus vivante.
    3.  **Transitions sur les modales :** Animez l'apparition des modales (fondu, léger zoom) pour qu'elles ne "poppent" pas sèchement à l'écran.

**e. Gestion des "États Vides" (Empty States)**

*   **Problème :** Que voit l'utilisateur quand il n'a aucune recette, aucun plan ou aucun ami ? Une page blanche est décourageante.
*   **Préconisation :**
    1.  **Concevoir les états vides :** Pour chaque section, créez une vue spécifique pour l'absence de contenu.
    2.  **Exemple pour "Mes Recettes" :** Au lieu d'un vide, affichez une illustration sympathique, un message comme "Votre carnet de recettes est vide pour l'instant", et un bouton d'action clair et centré : "**+ Ajouter ma première recette**". Cela guide l'utilisateur et l'encourage à interagir.

**f. Simplification des Formulaires Complexes**

*   **Problème :** La modale d'ajout/édition de recette est très longue et peut être intimidante.
*   **Préconisation :**
    1.  **Formulaire multi-étapes :** Divisez la modale en 2 ou 3 étapes avec des boutons "Suivant" et "Précédent".
        *   Étape 1 : Informations générales (nom, catégorie, temps, etc.).
        *   Étape 2 : Ajout des ingrédients.
        *   Étape 3 : Rédaction des étapes de préparation.
    2.  Cela rend le processus plus digeste et moins impressionnant pour l'utilisateur.

En appliquant ces améliorations, GustoPlan peut passer d'une application fonctionnellement riche à une expérience utilisateur véritablement exceptionnelle, intuitive et mémorable.
