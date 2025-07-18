# 📘 xcraft-materials

## Aperçu

Le module `xcraft-materials` fournit une collection de composants d'interface utilisateur pour les applications en mode terminal (TTY) dans l'écosystème Xcraft. Il implémente un système de communication basé sur le pattern Flux/Reflux pour gérer les événements et les actions entre les composants visuels et le bus de communication Xcraft.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Détails des sources](#détails-des-sources)

## Structure du module

Le module s'organise autour de trois composants principaux :

- **Composants TTY** : Éléments visuels pour l'interface en mode terminal (logo, progress bar, texte, activité, etc.)
- **Actions Reflux** : Gestionnaires d'actions pour déclencher les événements
- **Stores Reflux** : Gestionnaires d'état pour maintenir et distribuer les données aux composants
- **Système de réaction** : Pont de communication avec le bus Xcraft via Axon ou IPC

## Fonctionnement global

Le module utilise l'architecture Flux via `xcraft-reflux` pour gérer le flux de données unidirectionnel :

1. **Réception d'événements** : Les événements arrivent du bus Xcraft via `xcraftReaction`
2. **Distribution aux stores** : Chaque store écoute des événements spécifiques et met à jour son état
3. **Notification aux composants** : Les composants TTY s'abonnent aux stores et se mettent à jour automatiquement
4. **Affichage terminal** : Les composants rendent l'information dans le terminal avec coloration et formatage

Le système supporte deux modes de communication :

- **Mode Axon** : Communication via le bus Xcraft avec `busClient`
- **Mode IPC** : Communication directe via Inter-Process Communication (legacy)

## Exemples d'utilisation

### Initialisation basique

```javascript
const materials = require('xcraft-materials');

// Initialisation pour terminal avec réaction aux événements
const components = materials('tty', true, busClient);

// Activation des composants
components.XcraftLogo();
components.Motd();
components.Activity();
components.Progress();
components.Text();
components.GameOver();
```

### Affichage du logo Xcraft

```javascript
const materials = require('xcraft-materials')('tty', true);

// Initialiser le composant logo
materials.XcraftLogo();

// Déclencher l'affichage
materials.Actions.displayLogo();
```

### Affichage d'une barre de progression

```javascript
// Le composant Progress écoute automatiquement les événements 'widgetProgress'
// Les données doivent contenir : position, length, prefix, mod, topic
const progressData = {
  position: 50,
  length: 100,
  prefix: '[BUILD]',
  mod: 'webpack',
  topic: 'Compilation en cours',
};

// L'événement sera automatiquement capturé par le store et affiché
```

### Affichage de messages texte

```javascript
// Les messages sont automatiquement capturés selon leur niveau
// Exemple de données pour un message d'information :
const textData = {
  prefix: '[INFO]',
  mod: 'builder',
  text: 'Compilation terminée avec succès',
};

// L'événement 'widgetTextInfo' sera traité par le textstore
```

## Interactions avec d'autres modules

Le module `xcraft-materials` s'intègre étroitement avec l'écosystème Xcraft :

- **[xcraft-reflux]** : Architecture Flux pour la gestion d'état
- **[xcraft-core-fs]** : Système de fichiers pour le chargement dynamique des stores
- **[xcraft-core-log]** : Système de logging et décoration des messages
- **[xcraft-core-utils]** : Utilitaires pour le formatage et la manipulation de chaînes
- **Bus Xcraft** : Communication bidirectionnelle avec les autres modules via événements

## Détails des sources

### `xcraft-materials.js`

Point d'entrée principal du module qui expose les composants selon le type d'interface demandé. Supporte actuellement deux modes :

- **'tty'** : Composants pour interface terminal avec tous les composants disponibles
- **'web'** : Interface web (actuellement vide, retourne un objet vide)

Le module initialise optionnellement le système de réaction Xcraft si les paramètres `reaction` et `busClient` sont fournis.

### Actions

#### `ttyComponentsActions.js`

Définit les actions Reflux pour contrôler l'affichage des composants TTY :

- **`displayLogo`** — Déclenche l'affichage du logo Xcraft
- **`displayGameOver`** — Affiche le message de fin de session

#### `xcraftCommands.js`

Action pour envoyer des commandes vers le bus Xcraft :

- **`send`** — Transmet une commande au système de bus

#### `xcraftEvents.js`

Génère dynamiquement les actions Reflux basées sur les dépendances d'événements déclarées dans les stores. Le système :

- Scanne automatiquement tous les fichiers `*store.js` dans le dossier `stores/`
- Extrait les `eventDependencies` de chaque store
- Crée les actions Reflux correspondantes
- Supporte le chargement via Node.js et WebPack

#### `xcraftReaction.js`

Système de réaction qui établit la communication entre les actions/événements Reflux et le bus Xcraft. Gère deux modes de communication :

- **Axon** : Via `busClient` pour la communication réseau avec logging via `xcraft-core-log`
- **IPC** : Communication inter-processus directe (legacy)

### Stores

#### `activitystore.js`

Gère l'affichage de l'activité du système en écoutant l'événement `activityStatus`. Transmet les données sur les tâches en attente et en cours d'exécution.

#### `motdstore.js`

Gère l'affichage du message du jour (MOTD) en écoutant l'événement `motd`. Contient les informations de connexion et de bienvenue.

#### `progressstore.js`

Gère l'affichage des barres de progression en écoutant l'événement `widgetProgress`. Transmet les données de progression avec position, longueur et métadonnées.

#### `textstore.js`

Gère l'affichage de texte avec différents niveaux de logging. Chaque niveau d'événement est traité et préfixé avec son type :

- **`widgetTextVerb`** : Messages verbeux (préfixe 'verb')
- **`widgetTextInfo`** : Messages informatifs (préfixe 'info')
- **`widgetTextWarn`** : Avertissements (préfixe 'warn')
- **`widgetTextErr`** : Erreurs (préfixe 'err')
- **`widgetTextDbg`** : Messages de débogage (préfixe 'dbg')

#### `gadgetsstore.js`

Gère l'affichage de listes de gadgets en écoutant l'événement `gadgetList`.

### Composants TTY

#### `xcraftlogo.js`

Affiche le logo ASCII art "Xcraft" en utilisant la fonction graffiti de `xcraft-core-utils`. S'active via l'action `displayLogo` et affiche le logo avec des espaces avant et après pour la mise en forme.

#### `motd.js`

Affiche le message de bienvenue avec les informations de connexion formatées en couleurs :

- Nom de l'orc (utilisateur) en gris
- Serveur et ports de communication (commandes et événements)
- Message du jour avec unité et race
- Texte du MOTD en vert avec préfixe stylisé

#### `gameover.js`

Affiche un message stylisé "Game Over" avec une combinaison de couleurs (points gris, deux-points blancs, texte vert) centré avec des espaces.

#### `activity.js`

Affiche l'état d'activité du système sous forme de deux listes formatées :

- **Waiting** : Tâches en attente (titre en jaune)
- **Running** : Tâches en cours d'exécution (titre en vert)

Chaque tâche affiche l'orc, l'ID et la commande avec un alignement automatique sur 60 et 20 caractères. Affiche "N/A" si aucune tâche n'est présente.

#### `progress.js`

Implémente deux types de barres de progression avec formatage coloré avancé :

**ProgressBar** : Barre de progression classique avec :

- Largeur adaptative (max 80 caractères, moitié de la largeur du terminal)
- Affichage du pourcentage et temps estimé
- Caractères '=' pour la progression, espaces pour le reste

**ProgressInf** : Indicateur rotatif pour les tâches de durée indéterminée :

- Animation avec caractères rotatifs : `/`, `-`, `\`, `|`
- Largeur fixe d'un caractère

Le formatage inclut préfixe, module, barre de progression et sujet avec coloration complète.

#### `text.js`

Gère l'affichage de texte formaté avec optimisations pour le terminal :

- **Effacement de ligne** : Utilise les codes ANSI pour effacer la ligne courante
- **Gestion de la largeur** : S'adapte à la largeur du terminal
- **Optimisation des répétitions** : Évite de répéter les préfixes identiques consécutifs
- **Intégration avec xcraft-core-utils** : Utilise le système de décoration pour le formatage des couleurs et l'indentation

Le composant gère les codes ANSI pour le déplacement du curseur et l'effacement, permettant une mise à jour fluide des messages dans le terminal.

---

_Documentation mise à jour automatiquement_

[xcraft-reflux]: https://github.com/Xcraft-Inc/xcraft-reflux
[xcraft-core-fs]: https://github.com/Xcraft-Inc/xcraft-core-fs
[xcraft-core-log]: https://github.com/Xcraft-Inc/xcraft-core-log
[xcraft-core-utils]: https://github.com/Xcraft-Inc/xcraft-core-utils