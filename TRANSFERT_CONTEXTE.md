# 🚀 Transférer votre Contexte Antigravity (Bureau ↔ Maison)

Pour continuer notre session de pair-programming sur un autre ordinateur sans perdre le fil des tâches, du plan d'implémentation et de ma "mémoire" du projet, suivez ces étapes.

## 1. Synchroniser le Code (Git)
Assurez-vous que votre projet est sur un dépôt distant (GitHub, GitLab, etc.).
- **Au bureau** : `git push`
- **À la maison** : `git clone` (ou `git pull`)

## 2. Transférer la "Mémoire" d'Antigravity
Mes fichiers de travail (tâches, plans, walkthroughs) sont stockés dans un dossier caché sur votre session utilisateur Windows.

**Chemin à copier :**
`C:\Users\jp\.gemini`

### Étapes :
1. Copiez l'intégralité du dossier `.gemini` sur une clé USB ou un service de cloud (Drive, Dropbox).
2. Collez-le sur votre PC perso au même endroit : `C:\Users\[VotreNom]\.gemini`.
3. L'ID de session actuel est : `970b08fe-2552-4fb0-9a87-e017ec93e517`

## 3. Retrouver la Discussion
Connectez-vous avec le même compte Google sur votre PC perso. Le fil de discussion sera dans votre historique.

---
> [!IMPORTANT]
> **Méthode Automatique (OneDrive / Dropbox)** :
> Pour que la synchronisation soit invisible et permanente, utilisez un **Lien Symbolique** :

> 1. Déplacez votre dossier `.gemini` actuel dans votre dossier OneDrive (ex: `C:\Users\jp\OneDrive\.gemini`).
> 2. Ouvrez un terminal (PowerShell) en **mode Administrateur**.
> 3. Tapez la commande suivante pour créer le lien :
>    ```powershell
>    # Sur le PC Bureau
>    mklink /J "C:\Users\jp\.gemini" "C:\Users\jp\OneDrive\.gemini"
>    ```
> 4. Faites la même chose sur votre PC perso (en adaptant le nom d'utilisateur si besoin).
>
> Désormais, chaque modification que je fais au bureau sera instantanément disponible chez vous ! 🚀
