# Analyse & Améliorations de la Saisonnalité GustoPlan

## 1. État des Lieux (Ce qui existe déjà)
La gestion de la saisonnalité est **actuellement très robuste** dans votre application.

### Données
*   **Recettes (`recipes.js`)** : Les recettes possèdent des métadonnées explicites (`months` ou `seasons`) qui définissent leur période idéale.
*   **Ingrédients (`ingredients.js`)** : Chaque ingrédient a une liste de mois ou de saisons de disponibilité.

### Moteur (`SeasonManager`)
La classe `SeasonManager` calcule un score de saisonnalité en temps réel :
*   **Score 2** : De saison (Le mois courant correspond).
*   **Score 0** : Hors saison.
*   *Note* : Si aucune donnée n'est renseignée, le score est de 2 par défaut (considéré disponible toute l'année).

### Fonctionnalités Actives
*   **Badges Visuels** : Un badge "De saison" (Vert) ou "Hors saison" (Gris) s'affiche sur les cartes Recettes et Ingrédients.
*   **Détail** : La liste des mois favorables est affichée sous forme de capsules bleues.
*   **Tri Automatique** : Les listes sont triées pour afficher les produits de saison en premier.
*   **Filtres** : Configuration possible pour masquer ou griser les éléments hors saison.

---

## 2. Propositions d'Améliorations

Pour aller plus loin et donner du sens à ces données (notamment sur l'aspect écologique et aide à la décision), voici 3 axes de développement :

### A. 🌍 Indicateur d'Impact Carbone (Eco-Score Simplifié)
Transformer la contrainte "Saison" en information écologique positive.
*   **Le Concept** : Un fruit/légume hors saison a souvent un bilan carbone désastreux (Serre chauffée ou Transport avion).
*   **Implémentation** :
    *   Si Catégorie = "Fruits & Légumes" ET Score = 0 (Hors Saison) ➔ 🔴 **Impact Élevé**.
    *   Si Catégorie = "Fruits & Légumes" ET Score = 2 (De Saison) ➔ 🟢 **Impact Faible**.
*   **Visuel** : Ajouter une petite feuille colorée (Vert/Orange/Rouge) à côté du nom de l'ingrédient ou de la recette.

### B. 📅 Générateur de "Menu de Saison"
Utiliser l'IA ou un algorithme simple pour prémâcher le travail de planification.
*   **Le Concept** : Un bouton "Suggérer un repas de saison" qui remplit une case vide du planning.
*   **Implémentation** : L'algorithme sélectionne aléatoirement une Entrée, un Plat et un Dessert parmi ceux ayant un `SeasonScore = 2`.
*   **Bénéfice** : Gain de temps immédiat et garantie de manger de saison sans réfléchir.

### C. ⚠️ Assistant de Liste de Courses (Sobriété)
Intervenir au moment critique de l'achat pour éduquer/alerter.
*   **Le Concept** : Si l'utilisateur ajoute manuellement un produit hors saison (ex: "Tomates" en Janvier).
*   **Implémentation** :
    *   Afficher une notification douce (Toast) : *"Ce produit n'est pas de saison, son prix et son impact carbone sont sûrement élevés."*
    *   (Plus avancé) Suggérer une alternative : *"Pourquoi pas des Poireaux ou des Courges ?"*

---

## Conclusion
Votre base technique est prête pour ces évolutions. L'Indicateur Carbone est l'amélioration la plus visuelle et la plus rapide à mettre en œuvre ("Quick Win"). Le Générateur de Menu apporterait une vraie valeur ajoutée d'usage au quotidien.
