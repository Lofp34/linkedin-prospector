# 🚀 DÉMARRAGE RAPIDE - APPLICATION LINKEDIN MCP

## 📋 Vue d'ensemble

Cette application autonome utilise **Model Context Protocol (MCP)** pour effectuer des recherches LinkedIn réelles via **Horizon Data Wave**. Elle fonctionne entièrement en dehors de Cursor avec une architecture client-serveur MCP.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Interface Web  │───▶│   Client MCP    │───▶│  Serveur MCP    │
│  (Port 3002)    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │ Horizon Data    │
                                              │ Wave API        │
                                              └─────────────────┘
```

## 🔧 Installation

### 1. Installer les dépendances MCP

```bash
# Utiliser le package.json MCP
cp package-mcp.json package.json

# Installer toutes les dépendances
npm run setup
```

### 2. Configuration Horizon Data Wave

```bash
# Créer le fichier d'environnement
echo "HORIZON_API_KEY=votre_clé_api_horizon" > .env
```

## 🚀 Démarrage

### Option 1 : Démarrage automatique (recommandé)

```bash
# Démarre le serveur MCP ET le client web
npm run dev
```

### Option 2 : Démarrage manuel

```bash
# Terminal 1 : Serveur MCP
npm run server

# Terminal 2 : Client web + API REST
npm start
```

## 🔍 Utilisation

### Interface Web
- **URL :** http://localhost:3002
- **Fonctionnalités :**
  - ✅ Recherche basique (nom/prénom + critères optionnels)
  - ✅ Recherche par email
  - ✅ Recherche avancée Sales Navigator
  - ✅ Détails de profils complets
  - ✅ Statut MCP en temps réel

### API REST

#### Recherche basique
```bash
curl -X POST http://localhost:3002/api/search-linkedin \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Laurent",
    "lastName": "Serre", 
    "location": "Montpellier",
    "company": "Laurent Serre Développement"
  }'
```

#### Recherche par email
```bash
curl -X POST http://localhost:3002/api/search-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "laurent@example.com"
  }'
```

#### Détails de profil
```bash
curl -X POST http://localhost:3002/api/profile-details \
  -H "Content-Type: application/json" \
  -d '{
    "userIdentifier": "https://linkedin.com/in/user-profile"
  }'
```

## 🛠️ Outils MCP Disponibles

1. **`search_linkedin_users`**
   - Recherche par nom/prénom avec critères optionnels
   - Paramètres : first_name*, last_name*, company, location, title, keywords, count

2. **`get_linkedin_profile`**
   - Récupération détaillée d'un profil
   - Paramètres : user*, with_experience, with_education, with_skills

3. **`search_linkedin_by_email`**
   - Recherche par adresse email
   - Paramètres : email*, count

4. **`advanced_linkedin_search`**
   - Recherche Sales Navigator avancée
   - Paramètres : count*, companies, locations, functions, levels, industry

## 🔍 Tests et Diagnostics

### Vérifier le statut MCP
```bash
curl http://localhost:3002/health
```

### Lister les outils MCP
```bash
curl http://localhost:3002/api/tools
```

### Test du serveur MCP seul
```bash
npm run test-mcp
```

## 📊 Exemples de réponses

### Recherche basique
```json
{
  "success": true,
  "results": [
    {
      "name": "Laurent Serre",
      "headline": "Dirigeant chez Laurent Serre Développement",
      "company": "Laurent Serre Développement", 
      "location": "Greater Montpellier Metropolitan Area",
      "url": "https://linkedin.com/in/laurentserre34"
    }
  ],
  "count": 1,
  "raw_response": "🔍 Résultats de recherche pour \"Laurent Serre\":\n\n1. 👤 Laurent Serre\n   💼 Dirigeant chez Laurent Serre Développement..."
}
```

## 🔧 Configuration avancée

### Variables d'environnement
```bash
# .env
HORIZON_API_KEY=votre_clé_api
HORIZON_API_BASE=https://api.horizondatawave.ai
MCP_SERVER_PORT=3003
WEB_CLIENT_PORT=3002
DEBUG_MCP=true
```

### Configuration MCP personnalisée
```javascript
// Dans mcp-linkedin-server.js
const HORIZON_CONFIG = {
  apiKey: process.env.HORIZON_API_KEY,
  baseURL: process.env.HORIZON_API_BASE || 'https://api.horizondatawave.ai',
  timeout: 30000,
  retries: 3
};
```

## 🐛 Dépannage

### Problème : Client MCP non connecté
**Solution :**
```bash
# Vérifier que le serveur MCP est démarré
ps aux | grep mcp-linkedin-server

# Redémarrer les services
npm run dev
```

### Problème : Erreur API Horizon Data Wave
**Solution :**
```bash
# Vérifier la clé API
echo $HORIZON_API_KEY

# Tester l'API manuellement
curl -H "Authorization: Bearer $HORIZON_API_KEY" \
  https://api.horizondatawave.ai/health
```

### Problème : Port déjà utilisé
**Solution :**
```bash
# Changer les ports dans package-mcp.json
"scripts": {
  "start": "PORT=3004 node mcp-linkedin-client.js"
}
```

## 📚 Documentation technique

- **MCP Specification :** https://modelcontextprotocol.io/
- **Horizon Data Wave :** https://api.horizondatawave.ai/redoc
- **Architecture MCP :** Voir `mcp-linkedin-server.js` et `mcp-linkedin-client.js`

## 🔄 Mise à jour

```bash
# Mettre à jour les dépendances MCP
npm update @modelcontextprotocol/sdk

# Mettre à jour l'application
git pull origin main
npm install
```

## 🎯 Prochaines étapes

1. **Configurer votre clé API Horizon Data Wave**
2. **Démarrer l'application :** `npm run dev`
3. **Tester avec vos propres recherches**
4. **Personnaliser selon vos besoins**

---

🎉 **Votre application LinkedIn MCP autonome est prête !**

**Interface :** http://localhost:3002  
**API :** http://localhost:3002/api/*  
**Santé :** http://localhost:3002/health 