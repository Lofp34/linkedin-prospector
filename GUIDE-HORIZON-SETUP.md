# 🔥 GUIDE COMPLET - Migration vers Horizon Data Wave (VRAIES API LinkedIn)

## 📋 **Vue d'ensemble**

Ce guide vous explique comment migrer votre application MCP LinkedIn de la simulation vers les **vraies APIs LinkedIn** via Horizon Data Wave.

## 🎯 **ÉTAPE 1 : Inscription & Credentials**

### 1.1 Créer un compte Horizon Data Wave
```bash
# 1. Aller sur https://app.horizondatawave.ai
# 2. S'inscrire avec email
# 3. Récupérer vos credentials :
#    - HDW_ACCESS_TOKEN
#    - HDW_ACCOUNT_ID
# 4. BONUS: 100 requêtes GRATUITES par mois !
```

### 1.2 Configurer les variables d'environnement
```bash
# Créer un fichier .env.hdw
echo "HDW_ACCESS_TOKEN=VOTRE_TOKEN_ICI" > .env.hdw
echo "HDW_ACCOUNT_ID=VOTRE_ACCOUNT_ID_ICI" >> .env.hdw
```

## 🔧 **ÉTAPE 2 : Installation Serveur MCP Officiel**

### 2.1 Installation du serveur MCP Horizon Data Wave
```bash
# Option 1: Via NPM (Recommandé)
npm install -g @horizondatawave/mcp

# Option 2: Via GitHub
git clone https://github.com/horizondatawave/hdw-mcp-server.git
cd hdw-mcp-server
npm install
npm run build
```

### 2.2 Test de connexion
```bash
# Test avec le serveur officiel
HDW_ACCESS_TOKEN=votre_token HDW_ACCOUNT_ID=votre_account npx @horizondatawave/mcp
```

## 🔄 **ÉTAPE 3 : Migration de l'Application**

### 3.1 Modifier le package.json
```json
{
  "scripts": {
    "hdw-real": "HDW_ACCESS_TOKEN=$HDW_ACCESS_TOKEN HDW_ACCOUNT_ID=$HDW_ACCOUNT_ID node mcp-linkedin-client-hdw.js",
    "dev-real": "concurrently \"npm run hdw-real\" \"echo 'Serveur HDW démarré sur port 3003'\"",
    "setup-hdw": "cp .env.hdw.example .env.hdw && echo 'Configurez vos tokens HDW dans .env.hdw'"
  },
  "dependencies": {
    "@horizondatawave/mcp": "latest"
  }
}
```

### 3.2 Architecture proposée
```
Interface Web (Port 3003) → Client MCP HDW → Serveur MCP Officiel HDW → Horizon Data Wave API → LinkedIn Data RÉELLES
```

## 📊 **ÉTAPE 4 : Outils HDW Disponibles**

### 4.1 Recherche utilisateurs (Remplace notre simulation)
```javascript
// Ancien (simulation)
await client.callTool({ name: 'search_linkedin_users', ... })

// Nouveau (HDW réel)
await client.callTool({ 
  name: 'mcp_hdw_search_linkedin_users',
  arguments: {
    keywords: "software engineer",
    company_keywords: "Google",
    location: "Paris",
    count: 10
  }
})
```

### 4.2 Profil complet (Données réelles)
```javascript
await client.callTool({
  name: 'mcp_hdw_get_linkedin_profile',
  arguments: {
    user: "https://linkedin.com/in/username",
    with_experience: true,
    with_education: true,
    with_skills: true
  }
})
```

### 4.3 Recherche par email (Nouveau !)
```javascript
await client.callTool({
  name: 'mcp_hdw_get_linkedin_email_user',
  arguments: {
    email: "test@example.com",
    count: 5
  }
})
```

## 💰 **ÉTAPE 5 : Gestion des Coûts**

### 5.1 Monitoring d'usage
```javascript
// Compteur de requêtes
let requestCount = 0;
const MAX_FREE_REQUESTS = 100;

function trackRequest() {
  requestCount++;
  console.log(`Requêtes utilisées: ${requestCount}/${MAX_FREE_REQUESTS}`);
  
  if (requestCount >= MAX_FREE_REQUESTS) {
    console.warn('⚠️ Limite gratuite atteinte. Prochaines requêtes: $0.025 chacune');
  }
}
```

### 5.2 Cache intelligent
```javascript
// Cache des résultats pour éviter les requêtes répétées
const profileCache = new Map();

async function getCachedProfile(userUrl) {
  if (profileCache.has(userUrl)) {
    console.log('💰 Utilisation du cache - Requête économisée!');
    return profileCache.get(userUrl);
  }
  
  const result = await hdwClient.getProfile(userUrl);
  profileCache.set(userUrl, result);
  trackRequest();
  return result;
}
```

## 🔐 **ÉTAPE 6 : Sécurité & Bonnes Pratiques**

### 6.1 Protection des tokens
```bash
# Ne JAMAIS commiter les tokens
echo ".env.hdw" >> .gitignore
echo "config/hdw-secrets.json" >> .gitignore
```

### 6.2 Rate limiting
```javascript
// Limiter les requêtes pour respecter les limites API
const rateLimit = require('express-rate-limit');

const hdwRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requêtes par minute
  message: 'Trop de requêtes HDW, réessayez dans 1 minute'
});

app.use('/api/hdw-', hdwRateLimit);
```

## 🚀 **ÉTAPE 7 : Commandes de Démarrage**

### 7.1 Setup initial
```bash
# 1. Configuration des credentials
npm run setup-hdw

# 2. Modifier .env.hdw avec vos vrais tokens
nano .env.hdw

# 3. Lancer en mode Horizon Data Wave
npm run dev-real
```

### 7.2 Tests de validation
```bash
# Test 1: Vérifier la connexion HDW
curl -X POST http://localhost:3003/api/hdw-status

# Test 2: Recherche réelle LinkedIn
curl -X POST http://localhost:3003/api/hdw-search \
  -H "Content-Type: application/json" \
  -d '{"keywords": "developer", "location": "Paris", "count": 3}'

# Test 3: Profil complet réel
curl -X POST http://localhost:3003/api/hdw-profile \
  -H "Content-Type: application/json" \
  -d '{"user": "https://linkedin.com/in/test-profile"}'
```

## 📈 **ÉTAPE 8 : Avantages de la Migration**

### ✅ **Données 100% Réelles**
- Profils LinkedIn authentiques
- Données d'entreprises à jour
- Historique de postes réel
- Compétences et formations exactes

### ✅ **Fonctionnalités Avancées**
- Recherche par email
- Envoi de messages LinkedIn
- Gestion des connexions
- Posts et interactions
- Données d'entreprises complètes

### ✅ **Scalabilité**
- 100 requêtes gratuites/mois
- Puis $0.025/requête (très abordable)
- Aucune limite technique
- Support officiel

## ⚠️ **Points d'Attention**

### 🔴 **Respect des ToS LinkedIn**
- Horizon Data Wave gère la conformité
- Utilisation via API officielle
- Pas de scraping direct
- Respecte les limites LinkedIn

### 🔋 **Gestion de la Consommation**
- Implémenter un cache intelligent
- Rate limiting côté client
- Monitoring d'usage en temps réel
- Alertes avant dépassement

## 🎯 **Résultat Final**

Votre application aura accès à :
- **Vraies données LinkedIn en temps réel**
- **31 outils MCP professionnels**
- **Interface web inchangée (compatibilité)**
- **Architecture MCP standard respectée**
- **Coûts maîtrisés avec 100 requêtes gratuites**

---

## 🚀 **Prêt pour la Migration ?**

1. **Inscrivez-vous** : https://app.horizondatawave.ai
2. **Récupérez vos tokens**
3. **Suivez ce guide étape par étape**
4. **Profitez des vraies données LinkedIn !**

**Support** : Cette configuration vous donne accès aux vraies APIs LinkedIn de manière légale et sécurisée via Horizon Data Wave. 