# 🔍 Guide d'Utilisation - LinkedIn Profile Finder

## 📋 Vue d'ensemble

Cette application vous permet de rechercher des profils LinkedIn en utilisant nom, prénom et diverses caractéristiques (entreprise, localisation, poste, etc.) grâce aux outils MCP Horizon Data Wave.

## 🚀 Démarrage rapide

### 1. Installation
```bash
npm install
npm start
```

### 2. Accès à l'application
Ouvrez votre navigateur sur `http://localhost:3000`

## 🎯 Utilisation de l'interface web

### Champs de recherche :
- **Prénom** *(obligatoire)* : Le prénom de la personne
- **Nom de famille** *(obligatoire)* : Le nom de famille de la personne
- **Type de recherche** : Critère supplémentaire
  - Entreprise
  - Localisation
  - Poste/Titre
  - Mots-clés généraux
- **Valeur de recherche** : La valeur correspondant au type choisi
- **Nombre de résultats** : Entre 5 et 50 résultats

### Exemple d'utilisation :
1. Prénom : `Jean`
2. Nom : `Dupont`
3. Type : `Entreprise`
4. Valeur : `Google`
5. Cliquer sur "Rechercher"

## 🔧 Utilisation directe des outils MCP dans Cursor

### Recherche basique
```javascript
const resultats = await mcp_hdw_search_linkedin_users({
    first_name: "Jean",
    last_name: "Dupont",
    count: 5
});
```

### Recherche avec entreprise
```javascript
const resultats = await mcp_hdw_search_linkedin_users({
    first_name: "Marie",
    last_name: "Martin",
    current_company: "Google",
    location: "Paris, France",
    count: 10
});
```

### Obtenir les détails d'un profil
```javascript
const profil = await mcp_hdw_get_linkedin_profile({
    user: "marie-martin-dev",
    with_experience: true,
    with_education: true,
    with_skills: true
});
```

### Recherche par email
```javascript
const resultats = await mcp_hdw_get_linkedin_email_user({
    email: "jean.dupont@google.com",
    count: 3
});
```

### Recherche avancée Sales Navigator
```javascript
const resultats = await mcp_hdw_linkedin_sn_search_users({
    current_companies: ["Google", "Microsoft"],
    location: ["Paris, France"],
    functions: ["Engineering"],
    levels: ["Senior", "Director"],
    count: 20
});
```

## 📊 Paramètres de recherche disponibles

### Outils de recherche d'utilisateurs (`mcp_hdw_search_linkedin_users`)
| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `first_name` | string | Prénom exact | "Jean" |
| `last_name` | string | Nom de famille exact | "Dupont" |
| `current_company` | string | Entreprise actuelle | "Google" |
| `past_company` | string | Entreprise précédente | "Microsoft" |
| `location` | string | Localisation | "Paris, France" |
| `title` | string | Mot exact dans le titre | "Developer" |
| `keywords` | string | Mots-clés dans le profil | "JavaScript React" |
| `industry` | string | Secteur d'activité | "Technology" |
| `count` | number | Nombre max de résultats | 10 |
| `timeout` | number | Délai max en secondes | 300 |

### Outil de profil détaillé (`mcp_hdw_get_linkedin_profile`)
| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `user` | string | URL, URN ou alias du profil | "marie-martin-dev" |
| `with_experience` | boolean | Inclure l'expérience | true |
| `with_education` | boolean | Inclure l'éducation | true |
| `with_skills` | boolean | Inclure les compétences | true |

### Recherche Sales Navigator (`mcp_hdw_linkedin_sn_search_users`)
| Paramètre | Type | Description | Exemples |
|-----------|------|-------------|----------|
| `current_companies` | array | Entreprises actuelles | ["Google", "Microsoft"] |
| `location` | array | Localisations | ["Paris, France"] |
| `functions` | array | Fonctions métier | ["Engineering", "Marketing"] |
| `levels` | array | Niveaux de séniorité | ["Senior", "Director"] |
| `company_sizes` | array | Tailles d'entreprise | ["1,001-5,000"] |
| `industry` | array | Secteurs | ["Technology"] |
| `count` | number | Nombre max de résultats | 20 |

## 🔍 Types de recherche et exemples

### 1. Recherche par nom seulement
```javascript
// Trouver tous les "Jean Dupont"
const profils = await mcp_hdw_search_linkedin_users({
    first_name: "Jean",
    last_name: "Dupont",
    count: 10
});
```

### 2. Recherche par entreprise
```javascript
// Trouver "Marie Martin" qui travaille chez Google
const profils = await mcp_hdw_search_linkedin_users({
    first_name: "Marie",
    last_name: "Martin",
    current_company: "Google",
    count: 5
});
```

### 3. Recherche par localisation
```javascript
// Trouver "Pierre Durand" à Paris
const profils = await mcp_hdw_search_linkedin_users({
    first_name: "Pierre",
    last_name: "Durand",
    location: "Paris, France",
    count: 8
});
```

### 4. Recherche par poste
```javascript
// Trouver "Sophie Bernard" avec "Developer" dans son titre
const profils = await mcp_hdw_search_linkedin_users({
    first_name: "Sophie",
    last_name: "Bernard",
    title: "Developer",
    count: 10
});
```

### 5. Recherche par mots-clés
```javascript
// Trouver "Laurent Smith" avec JavaScript dans son profil
const profils = await mcp_hdw_search_linkedin_users({
    first_name: "Laurent", 
    last_name: "Smith",
    keywords: "JavaScript React",
    count: 10
});
```

## 📁 Structure des fichiers

### Application web
- `index.html` - Interface utilisateur
- `styles.css` - Styles et design
- `script.js` - Logique frontend
- `server.js` - Serveur Express.js

### Intégration MCP
- `mcp-integration.js` - Module d'intégration MCP
- `demo-mcp-search.js` - Démonstration complète
- `cursor-mcp-example.js` - Exemples pratiques
- `test-mcp-real.js` - Tests détaillés
- `simple-linkedin-search.js` - Exemple minimal

### Documentation
- `README.md` - Documentation technique
- `GUIDE-UTILISATION.md` - Ce guide d'utilisation
- `package.json` - Configuration npm

## ⚡ Conseils d'utilisation

### Bonnes pratiques
1. **Commencez simple** : Testez d'abord avec nom/prénom seulement
2. **Gérez les erreurs** : Utilisez toujours try/catch
3. **Respectez les limites** : Ne faites pas trop d'appels simultanés
4. **Timeout approprié** : Utilisez 300 secondes pour éviter les timeouts

### Gestion des erreurs
```javascript
try {
    const resultats = await mcp_hdw_search_linkedin_users({
        first_name: "Jean",
        last_name: "Dupont",
        count: 5
    });
    console.log(`Trouvé ${resultats.length} profil(s)`);
} catch (error) {
    console.error('Erreur de recherche:', error.message);
}
```

### Formatage des résultats
```javascript
resultats.forEach((profil, index) => {
    console.log(`${index + 1}. ${profil.first_name} ${profil.last_name}`);
    console.log(`   💼 ${profil.headline}`);
    console.log(`   🏢 ${profil.current_company}`);
    console.log(`   📍 ${profil.location}`);
    console.log(`   🔗 ${profil.profile_url}\n`);
});
```

## 🛠️ Configuration MCP dans Cursor

### Pré-requis
1. Accès aux outils MCP Horizon Data Wave
2. Token d'authentification LinkedIn configuré
3. Environnement Cursor avec MCP activé

### Remplacement des fonctions simulées
Dans les fichiers d'exemple, remplacez :

```javascript
// Simulation
const resultats = await simulerRechercheMCP(params);

// Par l'appel réel MCP
const resultats = await mcp_hdw_search_linkedin_users(params);
```

## 🔐 Sécurité et authentification

- Assurez-vous que vos tokens LinkedIn sont sécurisés
- Ne partagez jamais vos credentials d'API
- Respectez les conditions d'utilisation de LinkedIn
- Gérez les erreurs d'authentification appropriément

## 📈 Optimisation des performances

### Pagination
```javascript
// Pour de gros volumes, utilisez la pagination
const page1 = await mcp_hdw_search_linkedin_users({
    first_name: "Jean",
    last_name: "Dupont", 
    count: 25
});
```

### Filtrage efficace
```javascript
// Utilisez plusieurs critères pour réduire les résultats
const profils = await mcp_hdw_search_linkedin_users({
    first_name: "Marie",
    last_name: "Martin",
    current_company: "Google",
    location: "Paris, France",
    title: "Engineer",
    count: 10
});
```

## 🆘 Dépannage

### Problèmes courants

**Aucun résultat trouvé**
- Vérifiez l'orthographe des noms
- Essayez avec moins de critères
- Utilisez des variantes du nom d'entreprise

**Erreur de timeout**
- Augmentez la valeur du timeout
- Réduisez le nombre de résultats demandés
- Vérifiez votre connexion internet

**Erreur d'authentification**
- Vérifiez votre token LinkedIn
- Assurez-vous que le MCP est bien configuré
- Contactez l'administrateur système

### Messages d'erreur

| Erreur | Cause probable | Solution |
|--------|----------------|----------|
| "Network timeout" | Connexion lente | Augmenter timeout |
| "Authentication failed" | Token invalide | Vérifier credentials |
| "Rate limit exceeded" | Trop d'appels | Attendre avant nouveau test |
| "Invalid parameters" | Paramètres incorrects | Vérifier la syntaxe |

## 📞 Support

Pour toute question ou problème :
1. Consultez ce guide d'utilisation
2. Vérifiez les exemples dans les fichiers fournis
3. Testez avec des paramètres simples d'abord
4. Consultez la documentation MCP Horizon Data Wave

## 🔄 Mise à jour

Pour mettre à jour l'application :
```bash
git pull origin main
npm install
npm start
```

---

**Dernière mise à jour** : Décembre 2024  
**Version** : 1.0.0 