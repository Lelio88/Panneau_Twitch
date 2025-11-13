# LastShort - API YouTube Shorts

## Description

API Node.js permettant de récupérer automatiquement le dernier YouTube Short d'une chaîne. L'application propose deux endpoints : un pour générer une image avec miniature et titre du short, et un pour rediriger directement vers le short sur YouTube.

## Fonctionnalités

- **Détection automatique** : Identifie le dernier short parmi les 10 dernières vidéos publiées
- **Génération d'image** : Crée une image 1280×720px avec la miniature du short et son titre
- **Redirection directe** : Endpoint pour rediriger automatiquement vers le short sur YouTube
- **Filtrage par durée** : Sélectionne uniquement les vidéos de 60 secondes ou moins
- **API YouTube Data v3** : Intégration complète avec l'API YouTube

## Technologies utilisées

- Node.js
- Express.js
- Axios (requêtes HTTP)
- Canvas (génération d'images)
- YouTube Data API v3

## Structure du projet

```
lastshort/
├── index.js         # Serveur Express et logique API
├── package.json     # Dépendances npm
└── .env            # Variables d'environnement (non inclus)
```

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/Lelio88/lastshort.git
cd lastshort
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` avec vos identifiants :
```env
API_KEY=votre_cle_api_youtube
CHANNEL_ID=votre_id_de_chaine
PORT=3000
```

4. Lancer le serveur :
```bash
npm start
```

## Endpoints

### GET `/lastshort.png`
Génère et retourne une image PNG avec :
- La miniature du dernier short en fond
- Une bande noire semi-transparente en bas
- Le titre du short affiché

**Exemple** : `http://localhost:3000/lastshort.png`

### GET `/go`
Redirige automatiquement vers le dernier YouTube Short de la chaîne.

**Exemple** : `http://localhost:3000/go`

## Configuration YouTube API

1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activer l'API YouTube Data v3
3. Créer des identifiants (clé API)
4. Récupérer l'ID de votre chaîne YouTube

## Cas d'usage

- Overlay OBS pour afficher le dernier short en stream
- Widget sur site web pointant vers le dernier short
- Automatisation de partage de contenu sur réseaux sociaux
- Intégration dans des bots Discord/Twitch

## Limitations

- Requiert une clé API YouTube valide
- Soumis aux quotas de l'API YouTube Data v3
- Analyse uniquement les 10 dernières vidéos publiées

---

*API de récupération automatique du dernier YouTube Short d'une chaîne*