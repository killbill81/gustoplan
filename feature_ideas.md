# GustoPlan - Idées d'Améliorations Futures

## 1. 🛒 Expérience Magasin (UX Mobile)
Améliorer le confort d'utilisation pendant les courses.

*   **Wake Lock (Garder l'écran allumé)**
    *   **Problème** : Le téléphone se verrouille pendant les courses, obligeant à le déverrouiller constamment.
    *   **Solution** : Ajouter une option (bouton toggle) pour empêcher la mise en veille tant que la liste de courses est affichée.
*   **Mode Hors-Ligne (PWA)**
    *   **Problème** : Réseau souvent mauvais dans les hypermarchés (cages de Faraday).
    *   **Solution** : Transformer l'app en véritable PWA (Progressive Web App) avec une stratégie de cache agressive et une synchronisation différée (Firestore le gère en partie, mais le chargement initial de l'app doit être autonome).
*   **Calculateur de Prix**
    *   **Fonctionnalité** : Champ prix optionnel à côté des articles.
    *   **Bénéfice** : Estimation du total du caddy en temps réel pour maîtriser son budget avant la caisse.

## 2. 🧠 Intelligence & Automatisation
Rendre l'application plus intelligente pour faire gagner du temps.

*   **Tri Intelligent (Smart Sorting)**
    *   **Idée** : L'application analyse l'ordre dans lequel vous cochez les articles habituellement.
    *   **Bénéfice** : Proposition automatique d'un ordre des rayons personnalisé ("Vous prenez toujours les piles après le dentifrice ?").
*   **Gestion de Stock (Anti-Gaspillage)**
    *   **Idée** : Une vue "Placard / Frigo".
    *   **Fonctionnalité** : Permettre de basculer des articles de la liste de courses vers "En stock" au lieu de les supprimer complètement.

## 3. 🏗️ Architecture Technique
Consolider les bases du projet.

*   **Migration Complète vers React**
    *   **Constat** : Maintenance double (Vanilla JS + React) actuellement.
    *   **Bénéfice** : Une seule codebase à maintenir, meilleures performances, composants réutilisables (UI Kit), et expérience développeur plus fluide.
*   **Virtualisation des Listes**
    *   **Problème** : Si la liste de courses est très longue (100+ articles), le rendu peut ralentir sur de vieux téléphones.
    *   **Solution** : Utiliser la virtualisation (n'afficher que ce qui est visible à l'écran) pour une fluidité parfaite.

## 4. 🔗 Social & Collaboratif
*   **Courses en Temps Réel**
    *   **Idée** : Voir le curseur ou l'action de l'autre personne en direct.
    *   **Fun** : Gamification des courses (qui coche le plus vite ?).
