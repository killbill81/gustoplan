# 📋 Suivi des Points du Retour Audio - GustoPlan V2

Ce document assure le suivi des 10 points d'amélioration identifiés dans l'enregistrement audio des retours utilisateurs.

---

## 🛠️ Points Réalisés

### [x] **Point 1 : Vider / Réinitialiser la semaine**
*   *Demande* : Permettre de vider le planning facilement au changement de semaine sans devoir retirer les recettes une par une.
*   *Solution implémentée* : Ajout d'une boîte de dialogue de confirmation interactive "Vider la semaine" avec l'option de conserver ou supprimer également les ingrédients saisis manuellement.

### [x] **Point 2 : Clic direct sur un créneau vide du planning**
*   *Demande* : Saisir rapidement un plat directement depuis la grille du planning.
*   *Solution implémentée* : Clic sur une case vide qui ouvre un popover de planification rapide intégrant la recherche semi-automatique avec miniatures de recettes existantes ou la création d'une note libre (ex: *Restes*, *Resto*).

### [x] **Point 4 : Indicateur de recettes sans ingrédients (Icône "Info")**
*   *Demande* : Mettre le `i` (Info) en rouge s'il n'y a pas d'ingrédient sur la recette et en vert s'il y a des ingrédients. Ouvrir une bulle d'aide (tooltip) au survol indiquant si les ingrédients sont présents ou absents.
*   *Solution implémentée* : 
    *   Icône `Info` colorée dynamiquement : rose/rouge (`text-rose-500`) si vide, vert émeraude (`text-emerald-500`) si présente.
    *   Infobulle CSS moderne au survol avec les textes *"Ingrédients présents"* ou *"Pas d'ingrédients"*.

### [x] **Point 5 : Accompagnements / Aliments simples**
*   *Demande* : Ajouter des aliments simples (brocolis, riz, frites) sans créer de recette complète.
*   *Solution implémentée* : 
    *   Bouton dédié « Nouvel accompagnement » dans l'onglet des recettes.
    *   Formulaire adapté : titre, image, portions et masquage du sélecteur de catégorie.
    *   Saisie unique d'ingrédient associé (Nom, Quantité, Unité) avec autocomplétion.
    *   Synchronisation automatique de l'ingrédient avec le titre, et possibilité de le dissocier (ex: accompagnement *Frites* -> ingrédient *Pomme de terre*).
    *   Alerte intelligente au format `onBlur` demandant confirmation de création si l'ingrédient saisi n'existe pas dans la base.

### [x] **Point 8 : Processus d'ajout d'ingrédients manuels dans la base**
*   *Demande* : Créer un ingrédient inconnu est fastidieux. L'absence de suggestion pour les ingrédients saisis directement dans la liste de courses compliquait la réutilisation ultérieure. De plus, lors de l'ajout d'un nouvel ingrédient à une recette/accompagnement, il faut proposer une liste des unités existantes déjà enregistrées dans la base pour éviter les fautes de frappe et doublons, tout en permettant de saisir une unité personnalisée si elle n'est pas présente.
*   *Solution implémentée* : 
    *   Validation intelligente lors de la saisie d'un accompagnement.
    *   **Enregistrement automatique en base globale** : Chaque fois qu'un ingrédient saisi manuellement dans la liste de courses n'existe pas, il est instantanément créé et indexé dans la base d'ingrédients du foyer, le rendant immédiatement disponible pour l'autocomplétion.

---

## ⏳ Points Restants à Traiter

### [ ] **Point 3 : Support du tactile / Glisser-déposer sur mobile**
*   *Problème* : Le drag-and-drop est capricieux sur écran tactile.
*   *Proposition* : Ajuster les capteurs de `@dnd-kit` pour tolérer le tactile, et s'assurer qu'un appui simple propose également l'action de planification.

### [ ] **Point 6 : Doublons dans la recherche de recettes**
*   *Problème* : La recherche affiche parfois plusieurs fois la même recette.
*   *Proposition* : Dépendre uniquement de l'identifiant unique (`id`) de la recette pour dédoublonner les résultats de recherche.

### [ ] **Point 7 : Confirmation visuelle de sauvegarde automatique**
*   *Problème* : L'utilisateur n'est pas sûr que ses actions sont bien enregistrées en l'absence de bouton "Enregistrer".
*   *Proposition* : Ajouter un petit indicateur visuel discret dans le header (ex: un nuage avec une coche verte "Enregistré" ou un voyant lumineux vert).

### [ ] **Point 9 : Écran de connexion qui redirige trop rapidement / Gestion du Foyer**
*   *Problème* : Il est difficile de changer de foyer lors de la connexion car on est redirigé immédiatement si on a déjà un foyer lié.
*   *Proposition* : Ajouter une section **« Mon Foyer »** dans l'application (ex: au clic sur le profil/email en haut à droite) pour voir le code d'invitation, le copier ou quitter le foyer.

### [ ] **Point 10 : Partage de Foyer simplifié**
*   *Problème* : Le partage de mot de passe est souvent privilégié par facilité.
*   *Proposition* : Rendre le code du foyer ultra-visible et facile à partager en 1 clic.
