# Spectrum
Sur la base du projet & des fichiers : [HopperWatcher](https://github.com/busybox11/hopperwatcher) de [busybox11](https://github.com/busybox11)

bot Discord développé avec TypeScript et exécuté avec [Bun](https://bun.sh/). Ce bot gère automatiquement le bannissement de membres en fonction de listes de bannissement maintenues dans des fichiers. Les raisons de bannissement sont définies par le nom des fichiers de bannissement, ce qui permet une gestion centralisée et dynamique des bannissements du serveur dès qu'une personne essaie de rejoindre votre serveur Discord, un bannissement aura lieu si elle fait partie des listes prédéfinies..

## Fonctionnalités

- **Bannissement Automatique des Membres** : Lorsqu'un utilisateur rejoint le serveur, Spectrum vérifie si son ID figure dans une liste de bannissement. Si c'est le cas, il est automatiquement banni pour la raison associée.
- **Surveillance en Temps Réel** : Le bot surveille les changements dans le dossier contenant les fichiers de bannissement et met à jour les listes dynamiquement.
- **Gestion des Membres Actuels** : Au démarrage, le bot applique les règles de bannissement à tous les membres déjà présents, garantissant une application cohérente même après un redémarrage (vérifications automatique).

## Prérequis

- **Node.js** et **Bun** installés
- Un serveur Discord avec des permissions administratives
- Un bot Discord configuré avec le token d'accès et les permissions requises

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/PotiteBulle/Spectrum.git
   cd Spectrum
   ```

2. Installez les dépendances avec Bun :

   ```bash
   bun install
   ```

3. Créez un fichier `.env` dans le répertoire racine et configurez les variables d'environnement :

   ```env
   DISCORD_TOKEN=<Votre_token_discord>
   GUILD_ID=<ID_de_votre_serveur_discord>
   BANNISSEMENTS_DIR=./Bannissements
   ```

   - **DISCORD_TOKEN** : Le token du bot Discord.
   - **GUILD_ID** : L'ID du serveur où le bot sera actif.
   - **BANNISSEMENTS_DIR** : Le dossier où seront stockés les fichiers de bannissement.

4. Créez un dossier `Bannissements` dans le répertoire racine :

   ```bash
   mkdir Bannissements
   ```

5. Ajoutez des fichiers texte dans le dossier `Bannissements`. Chaque fichier représente une raison de bannissement et doit contenir les IDs des utilisateurs, un par ligne.

   Exemple :

   ```plaintext
   // Fichier: exemple-bannissements/spam.txt
   123456789012345678
   987654321098765432
   ```

   Les utilisateurs figurant dans `spam.txt` seront automatiquement bannis avec la raison : `[Spectrum] - spam`.

## Utilisation

Lancez le bot avec la commande suivante :

```bash
bun run index.ts
```

Une fois lancé, Spectrum :

1. Charge les listes de bannissement et applique immédiatement les bannissements aux membres déjà présents.
2. Surveille les modifications dans le dossier `Bannissements` pour des mises à jour dynamiques.
3. Bannit automatiquement tout nouveau membre correspondant à un ID dans une liste de bannissement.

## Exemple de Fichiers de Bannissement

```plaintext
// exemple-bannissements/contenu_illegal.txt
123456789012345678
234567890123456789
```

Ce fichier bannira les utilisateurs dont l'ID est listé avec la raison `[Spectrum] - contenu_illegal`.

## Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](https://github.com/PotiteBulle/Spectrum/blob/main/LICENSE) pour plus d’informations.

---

## Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou faire une pull request pour toute amélioration.

---

## Support

Pour toute question ou assistance, n'hésitez pas à ouvrir une issue.

## Mise en place d'un bot discord (Tuto): 
- Les informations détaillées se trouvent ici : [Bot Discord](https://leptitbot.com/comment-creer-un-bot-discord-2024/)