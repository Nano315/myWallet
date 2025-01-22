# README - Script d'Exportation de Transactions Firebase vers Excel

## 👩‍💻 Description
Ce script Python extrait les transactions financières stockées dans Firebase et les exporte dans un fichier Excel formaté. Chaque mois de l'année est représenté sur une feuille distincte avec des transactions organisées par catégorie et des graphiques illustrant les données.

---

## 📦 Fonctionnalités Principales

### 1. **Extraction de Données Firebase**
- Récupère les transactions depuis Firebase en utilisant les clés des transactions.
- Filtre les données par mois et année en cours.

### 2. **Organisation Mensuelle**
- Classe les transactions par mois avec traduction des noms des mois en français.
- Regroupe les transactions par catégorie pour un traitement simplifié.

### 3. **Génération de Feuilles Excel**
- Crée une feuille Excel pour chaque mois avec :
  - Les transactions listées ligne par ligne.
  - Les totaux par catégorie.
  - Une section pour les totaux mensuels : sorties, entrées et balance.

### 4. **Visualisation Graphique**
- Génère des graphiques en colonnes et des diagrammes circulaires pour illustrer les données financières.
- Intègre un onglet "BILAN" avec un résumé des données annuelles.

---

## 🚧 Structure du Script

### **Imports Principaux**
- `xlsxwriter` : Création et gestion des fichiers Excel.
- `firebase_admin` : Connexion et extraction des données depuis Firebase.
- `datetime` : Gestion des dates et des formats temporels.
- `collections.defaultdict` : Structure de données pour organiser les transactions par mois et catégorie.

### **Étapes du Script**

1. **Initialisation Firebase**
   - Connexion à Firebase via le fichier de clé de service `serviceAccountKey.json`.
   - Accès aux données via une référence de base.

2. **Traitement des Transactions**
   - Récupère toutes les transactions.
   - Filtre par année en cours et regroupe par mois.
   - Gestion des erreurs de conversion et de données manquantes.

3. **Création des Fichiers Excel**
   - Formatage des cellules pour une meilleure lisibilité (entêtes, contenu, formats monétaires).
   - Ajout des transactions par mois.
   - Génération de tableaux pour les totaux par catégorie.

4. **Visualisation Graphique**
   - Diagrammes circulaires pour la répartition des catégories.
   - Graphiques en colonnes pour les entrées, sorties et balances annuelles.

5. **Feuille "BILAN"**
   - Résumé des données mensuelles : sorties, entrées et balance.
   - Inclusion de graphiques pour une vue globale des finances annuelles.

---

## 🙇‍♀️ Installation

### Prérequis
- Python 3.x installé.
- Clé de service Firebase : `serviceAccountKey.json`.
- Module `xlsxwriter` installé :
  ```bash
  pip install xlsxwriter
  ```
- Module Firebase Admin SDK installé :
  ```bash
  pip install firebase-admin
  ```

### Configuration
1. Configurez Firebase :
   - Créez un projet Firebase.
   - Téléchargez la clé de service et placez-la dans le même répertoire que le script.
   - Mettez à jour l'URL de la base de données dans `configFirebase.py`.

2. Exécutez le script :
   ```bash
   python main.py
   ```

---

## 🚀 Utilisation

1. **Exécuter le Script** :
   - Le script crée un fichier `transactions_2025.xlsx` dans le répertoire courant.
2. **Explorer le Fichier Excel** :
   - Chaque mois a sa propre feuille contenant les transactions et graphiques.
   - L'onglet "BILAN" résume les données annuelles avec des graphiques détaillés.

---

## 🥐 Structure des Données Firebase

### Exemple de Transaction :
Transactions générées depuis l'application mywallet

```json
{
  "label": "Achat Supermarché",
  "categorie": "Alimentation",
  "prix": "-50.75",
  "date": "2025-01-15T10:30:00Z",
  "id": "12345"
}
```

