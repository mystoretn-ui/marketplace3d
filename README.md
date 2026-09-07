[README.md](https://github.com/user-attachments/files/31907303/README.md)
# Marketplace3D

Marketplace 3D inspiré de l'expérience visuelle MakerWorld.

## Fonctionnalités
- Accueil marketplace avec sidebar, recherche, catégories, hero et cartes de modèles
- Inscription / connexion / déconnexion
- Portfolio public automatique pour chaque utilisateur
- Modification du profil et réseaux sociaux
- Dashboard utilisateur
- Upload de modèles 3D (STL, OBJ, 3MF, ZIP, etc.)
- Modèles gratuits ou payants en USD
- Catégorie Car Parts
- Likes, favoris et commentaires
- Follow / unfollow
- Collections
- Compteurs de téléchargements
- Commission configurée à 19%
- Pages modèles et profils
- Dossiers d'upload inclus

## Installation
1. Installer Node.js.
2. Décompresser le projet.
3. Ouvrir un terminal dans le dossier du projet.
4. Exécuter:
   npm install
5. Puis:
   npm start
6. Ouvrir:
   http://localhost:3000

## Important
Le serveur crée automatiquement les données nécessaires au premier démarrage.
Ne supprimez pas le dossier `data`.
Les dossiers `uploads/models` et `uploads/profiles` sont déjà inclus et utilisés par le serveur.

## Paiements
Les modèles payants utilisent actuellement un paiement **DEMO local** : la vente et la commission de 19% sont enregistrées dans `data/db.json`. Un vrai paiement Stripe/PayPal nécessite les identifiants du compte marchand et une configuration de production.
