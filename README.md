# 🚀 LinkedIn Prospector - Application MCP avec Horizon Data Wave

> **Application complète de prospection LinkedIn utilisant les APIs réelles d'Horizon Data Wave via le protocole MCP (Model Context Protocol)**

## ✨ Fonctionnalités

### 🔍 Recherche LinkedIn Avancée
- **19 outils LinkedIn HDW disponibles** pour une prospection complète
- Recherche par nom, prénom, entreprise, localisation, titre
- Recherche avancée avec Sales Navigator
- Recherche par email LinkedIn
- Recherche d'entreprises via Google

### 👤 Profils et Données
- Profils LinkedIn complets (expérience, formation, compétences)
- Posts et réactions d'utilisateurs LinkedIn
- Employés d'entreprises LinkedIn
- Connexions utilisateurs

### 💬 Interactions LinkedIn  
- Messages et conversations LinkedIn
- Commentaires sur posts
- Invitations de connexion
- Publication de posts

### 🛠️ Fonctionnalités Techniques
- **Interface web moderne** sur port 3003
- **Cache intelligent** (30 minutes TTL)
- **Rate limiting** (15 requêtes/minute)
- **Monitoring d'usage** en temps réel
- **Vraies données LinkedIn** (pas de simulation)

## 🏗️ Architecture

```
Interface Web (Port 3003) → Client MCP HDW → Serveur MCP Officiel HDW → Horizon Data Wave API → LinkedIn Data RÉELLES
```

## 💰 Coûts et Usage

- **100 requêtes gratuites par mois**
- **0,025€ par requête** après épuisement du quota gratuit
- **Monitoring en temps réel** du nombre de requêtes utilisées
- **Cache intelligent** pour économiser les requêtes

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+ installé
- Compte Horizon Data Wave avec credentials

### Installation Automatique
```bash
# 1. Cloner le repository
git clone https://github.com/Lofp34/linkedin-prospector.git
cd linkedin-prospector

# 2. Exécuter le script d'installation
chmod +x setup-hdw.sh
./setup-hdw.sh

# 3. Configurer vos credentials HDW
# Éditez le fichier .env.hdw avec vos vrais credentials
```

### Configuration Manuelle
```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier .env.hdw
echo 'HDW_ACCESS_TOKEN="votre_token_hdw_ici"' > .env.hdw
echo 'HDW_ACCOUNT_ID="votre_account_id_ici"' >> .env.hdw

# 3. Lancer l'application
source .env.hdw && npm run dev-hdw
```

## 🔧 Utilisation

### Démarrage
```bash
# Option 1: Via npm script
source .env.hdw && npm run dev-hdw

# Option 2: Via variables d'environnement directes
HDW_ACCESS_TOKEN="votre_token" HDW_ACCOUNT_ID="votre_id" node mcp-linkedin-client-hdw.js
```

### Interface Web
- Ouvrez votre navigateur sur **http://localhost:3003**
- Interface intuitive pour toutes les recherches LinkedIn
- Résultats en temps réel avec données authentiques

### APIs Disponibles

#### Recherche d'utilisateurs
```bash
curl -X POST http://localhost:3003/api/search-linkedin \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Laurent", "lastName": "Serre", "location": "Montpellier"}'
```

#### Recherche par email
```bash
curl -X POST http://localhost:3003/api/search-linkedin-email \
  -H "Content-Type: application/json" \
  -d '{"email": "contact@example.com"}'
```

#### Recherche d'entreprises
```bash
curl -X POST http://localhost:3003/api/search-companies \
  -H "Content-Type: application/json" \
  -d '{"companies": ["Google", "Microsoft"]}'
```

## 📋 Outils HDW Disponibles

### 🔍 Recherche et Découverte
- `search_linkedin_users` - Recherche d'utilisateurs LinkedIn
- `linkedin_sn_search_users` - Recherche avancée Sales Navigator  
- `get_linkedin_email_user` - Recherche par email
- `get_linkedin_google_company` - Recherche d'entreprises via Google
- `google_search` - Recherche Google générale

### 👤 Profils et Détails
- `get_linkedin_profile` - Profil LinkedIn complet
- `get_linkedin_company` - Détails d'entreprise LinkedIn
- `get_linkedin_company_employees` - Employés d'entreprise

### 💬 Interactions et Messages
- `get_linkedin_chat_messages` - Messages LinkedIn
- `send_linkedin_chat_message` - Envoyer des messages
- `get_linkedin_conversations` - Liste des conversations
- `send_linkedin_connection` - Invitations de connexion

### 📝 Posts et Contenu
- `get_linkedin_user_posts` - Posts d'un utilisateur
- `get_linkedin_user_reactions` - Réactions d'un utilisateur
- `get_linkedin_post_comments` - Commentaires d'un post
- `get_linkedin_post_reposts` - Reposts d'un post
- `send_linkedin_post` - Publier un post
- `send_linkedin_post_comment` - Commenter un post

## 📁 Structure du Projet

```
linkedin-prospector/
├── mcp-linkedin-client-hdw.js    # Client MCP principal
├── index.html                    # Interface web responsive  
├── styles.css                    # Styles CSS modernes
├── package.json                  # Dépendances npm
├── GUIDE-HORIZON-SETUP.md        # Guide de configuration HDW
├── setup-hdw.sh                 # Script d'installation
├── .env.hdw                      # Configuration HDW (à créer)
└── public/                       # Fichiers statiques
```

## 🔒 Configuration Horizon Data Wave

### Obtenir vos Credentials
1. Inscription sur [Horizon Data Wave](https://horizondatawave.ai)
2. Récupération de votre `HDW_ACCESS_TOKEN` (format JWT)
3. Récupération de votre `HDW_ACCOUNT_ID` (UUID)

### Configuration
```bash
# Fichier .env.hdw
HDW_ACCESS_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
HDW_ACCOUNT_ID="97677466-dd8a-4bae-8e75-b1bfa9a3b482"
```

## 📊 Monitoring et Debug

### Logs en Temps Réel
- Connexion MCP HDW
- Requêtes LinkedIn avec timing
- Cache hits/misses
- Compteur de requêtes utilisées
- Erreurs d'API détaillées

### Exemple de Logs
```
✅ Connexion MCP HDW réussie!
🛠️ 19 outils HDW disponibles
🔍 Recherche HDW LinkedIn: laurent serre
💰 Requêtes HDW utilisées: 8/100
⚡ Cache hit - Requête économisée!
```

## 🆘 Dépannage

### Erreurs Courantes

**Erreur: Variables d'environnement manquantes**
```bash
# Solution: Vérifier le fichier .env.hdw
source .env.hdw && echo $HDW_ACCESS_TOKEN
```

**Erreur: MCP error -32601: Unknown tool**
```bash
# Solution: Utiliser les bons noms d'outils (sans préfixe mcp_hdw_)
# Correct: search_linkedin_users
# Incorrect: mcp_hdw_search_linkedin_users
```

**Erreur: API error: 412 Precondition Failed**
```bash
# Solution: Vérifier que le profile/email existe sur LinkedIn
# Certains profils peuvent être privés ou inexistants
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

Développé avec ❤️ pour la prospection LinkedIn moderne

---

> **Note**: Cette application utilise les APIs officielles Horizon Data Wave pour accéder aux vraies données LinkedIn. Respectez les conditions d'utilisation de LinkedIn et d'Horizon Data Wave. 