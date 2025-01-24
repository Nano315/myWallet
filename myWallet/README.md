# README - myWallet

## 🗒️ Description
Le but de cette application est de mieux gérer son budget personnel. Y'a une partie transactions pour ajouter des entrées et sorties d'argent. Y'a aussi un écran pour visualiser ses abonnements et les prochaines transactions

---

## 🧱 Fonctionnalités Principales

### 1. **Gestion des Budgets**
- Suivi du budget mensuel et total.
- Définition d'un objectif financier mensuel.

### 2. **Transactions**
- Consultation des transactions mensuelles.
- Interface pour suivre les dépenses et les revenus.
- Les composants `Transaction` et `Transactions` permettent d'afficher et de gérer les données liées aux transactions.

### 3. **Abonnements**
- Ajout et suppression d'abonnements mensuels.
- Aperçu des abonnements grâce à un calendrier intégré.

### 4. **Réglages**
- Modification des objectifs financiers.
- Gestion des étiquettes (ajout/suppression de labels).

### 5. **Dashboard**
- Visualisation des chiffres clés avec `DashboardChiffres`.
- Calendrier avec `DashboardCalendar` pour afficher les abonnements à venir.

### 6. **Navigation**
- Menu de navigation personnalisé en bas de l'application.
- Gestion des écrans à l'aide d'une stack et de tabs.

---

## 🚧 Structure du Projet

```plaintext
-> app
    -> tabs
        -> _layout.tsx
        -> index.tsx
        -> previewScreen.tsx
        -> reglagesScreen.tsx
    -> _layout.tsx
    -> +not-found.tsx
-> assets
    -> fonts
    -> images
-> components
   -> indexComponents
       -> dashboardChiffres.tsx
       -> transaction.jsx
       -> transactions.jsx
    -> modals
        -> modalAjoutLabel.tsx
        -> modalDeleteAbonnement.tsx
        -> modalEntreeArgent.tsx
        -> modalNouvelAbonnement.tsx
        -> modalSortieArgent.tsx
        -> modalSuppressionLabel.tsx
    -> previewComponents
        -> abonnement.jsx
        -> abonnements.jsx
        -> dashboardCalendar.jsx
    -> reglagesComponents
        -> label.jsx
    -> customTabButton.jsx
-> constants
    -> CONST_TEMPORELS.js
    -> Couleurs.ts
-> scripts
    -> budgetContext.js
```

---

## 🌸 Installation

### Prérequis
- Node.js et npm/yarn.
- Expo CLI installé.

### Étapes
1. Cloner le projet :
   ```bash
   git clone https://github.com/solene-drnx/myWallet-Public.git
   ```
2. Naviguer dans le dossier du projet :
   ```bash
   cd mywallet
   ```
3. Installer les dépendances :
   ```bash
   npm install
   ```
4. Configuration de Firebase
    Placez le fichier `serviceAccountKey.json` dans le dossier `constants`.
    Configurez les données manquantes Firebase dans `configFirebase.js`.
5. Lancer l'application :
   ```bash
   expo start
   ```

---

## 🕺 Utilisation

1. Démarrer l'application sur un émulateur ou un appareil physique.
2. Naviguer entre les écrans via le menu en bas de l'application.
3. Ajouter, modifier ou supprimer des budgets et abonnements selon vos besoins.
4. Consulter les rapports pour suivre vos finances.

---

## 🥸 Technologies Utilisées
- **React Native** pour le développement mobile.
- **Expo** pour simplifier la gestion des dépendances et l'exécution.
- **Firebase** pour la gestion des données en arrière-plan.
- **Context API** pour le partage de données globales.
