# README - myWallet Project

## 😵 Description
Ce repo GitHub contient deux composants principaux :
1. **MyWallet App** : Une application React Native pour la gestion des finances personnelles.
2. **Python Script** : Un script Python qui extrait les données Firebase et les exporte dans un fichier Excel pour une analyse plus poussée.

---

## 👾 Structure du Dépôt

```plaintext
mywallet/
├── .gitignore
├── (Fichiers de l'application React Native)
scriptPython/
├── .gitignore
├── export_transactions.py
├── serviceAccountKey.json (non inclus dans le repo)
```

---

## 💶 MyWallet App

### Description
L'application myWallet est une solution mobile de gestion des finances personnelles, développée avec React Native. Elle permet de :
- Suivre ton budgets mensuels et total.
- Gérer tes transactions.
- Organiser tes abonnements.
- Personnaliser ton objectif financier.

### Installation

#### Prérequis
- Node.js et npm/yarn.
- Expo CLI installé.

#### Étapes
1. Naviguez dans le dossier `mywallet` :
   ```bash
   cd mywallet
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez l'application :
   ```bash
   expo start
   ```

### Fonctionnalités
- Gestion des budgets.
- Suivi des transactions.
- Organisation des abonnements.

---

## 🧲 Script Python

### Description
Le script Python dans le dossier `scriptPython` extrait les transactions depuis Firebase et les exporte dans un fichier Excel formaté. Il génère des graphiques et des tableaux pour une analyse claire et visuelle des finances.

### Installation

#### Prérequis
- Python 3.x installé.
- Clé de service Firebase (`serviceAccountKey.json`, non incluse dans le dépôt).
- Modules Python requis :
  ```bash
  pip install firebase-admin xlsxwriter
  ```

#### Configuration
1. Placez le fichier `serviceAccountKey.json` dans le dossier `scriptPython`.
2. Configurez l'URL Firebase dans `configFirebase.py`.

#### Exécution
1. Naviguez dans le dossier `scriptPython` :
   ```bash
   cd scriptPython
   ```
2. Exécutez le script :
   ```bash
   python export_transactions.py
   ```

### Résultat
Un fichier `transactions_2025.xlsx` est généré, contenant :
- Une feuille par mois avec les transactions et les graphiques associés.
- Une feuille "BILAN" résumant les finances annuelles.

Des bisous
Solène