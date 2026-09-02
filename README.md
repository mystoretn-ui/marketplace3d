# Marketplace3D

MVP d'une marketplace de modèles 3D imprimables.

## Lancer en local
1. Installer Node.js 18+.
2. Dans ce dossier : `npm install`
3. Puis : `npm start`
4. Ouvrir `http://localhost:3000`

## Fonctionnalités MVP
- Accueil marketplace
- Recherche
- Comptes utilisateurs
- Upload STL / 3MF / OBJ / ZIP
- Publication de modèles
- Page modèle
- Enregistrement d'un achat de démonstration
- Téléchargement du fichier

## Important
Le paiement dans cette version est une **simulation**. Avant de vendre réellement, il faut connecter un vrai prestataire de paiement, sécuriser le stockage des fichiers, ajouter PostgreSQL/une base de données de production, contrôler les permissions de téléchargement et mettre `JWT_SECRET` dans les variables d'environnement.
