# 🔍 LinkedIn Profile Finder

Application web moderne pour rechercher des profils LinkedIn en utilisant les outils MCP Horizon Data Wave.

## ✨ Fonctionnalités

- **Recherche intuitive** : Interface utilisateur moderne et responsive
- **Critères multiples** : Recherche par nom, prénom, entreprise, localisation, poste ou mots-clés
- **Résultats détaillés** : Affichage complet des informations de profil
- **Integration MCP** : Utilise les outils Horizon Data Wave pour la recherche LinkedIn
- **Interface multilingue** : Interface en français

## 🛠️ Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Backend** : Node.js, Express.js
- **APIs** : Outils MCP Horizon Data Wave
- **Styling** : CSS moderne avec gradients et animations

## 📦 Installation

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Démarrer le serveur** :
   ```bash
   npm start
   ```

3. **Ouvrir l'application** :
   Rendez-vous sur `http://localhost:3000`

## 🚀 Utilisation

### Recherche de profils

1. **Saisir les informations** :
   - Prénom (obligatoire)
   - Nom de famille (obligatoire)
   - Type de recherche (entreprise, localisation, poste, mots-clés)
   - Valeur de recherche correspondante
   - Nombre de résultats souhaités

2. **Lancer la recherche** :
   - Cliquer sur "Rechercher"
   - Les résultats s'affichent avec les détails des profils

3. **Consulter les profils** :
   - Voir les informations détaillées
   - Accéder au profil LinkedIn complet
   - Obtenir plus de détails si nécessaire

### Types de recherche supportés

- **Entreprise** : Recherche par nom d'entreprise actuelle
- **Localisation** : Recherche par ville, région ou pays
- **Poste/Titre** : Recherche par intitulé de poste
- **Mots-clés** : Recherche libre dans les profils

## 🔧 Configuration MCP

### Outils Horizon Data Wave utilisés

L'application utilise les outils MCP suivants :

- `mcp_hdw_search_linkedin_users` - Recherche d'utilisateurs LinkedIn
- `mcp_hdw_get_linkedin_profile` - Détails complets d'un profil
- `mcp_hdw_get_linkedin_email_user` - Recherche par email
- `mcp_hdw_linkedin_sn_search_users` - Recherche avancée Sales Navigator

### Intégration dans Cursor

Pour utiliser les vrais outils MCP dans votre environnement Cursor :

1. Remplacez les fonctions `simulate*` dans `server.js`
2. Utilisez directement les outils MCP disponibles
3. Configurez vos tokens d'authentification si nécessaire

## 📚 Structure du projet

```
linkedin-profile-finder/
├── index.html          # Interface utilisateur principale
├── styles.css          # Styles et design moderne
├── script.js           # Logique frontend JavaScript
├── server.js           # Serveur Node.js et API
├── package.json        # Configuration npm
└── README.md          # Documentation
```

## 🎨 Interface utilisateur

- **Design moderne** : Interface épurée avec gradients et animations
- **Responsive** : Adaptation automatique aux différentes tailles d'écran
- **UX optimisée** : Feedback visuel, loading states, gestion d'erreurs
- **Accessibilité** : Conception accessible avec labels et contrastes appropriés

## 🔍 Paramètres de recherche avancés

L'application supporte de nombreux paramètres de recherche LinkedIn :

- Nom et prénom exacts
- Entreprise actuelle ou précédente
- Localisation géographique
- Secteur d'activité
- Niveau d'expérience
- Mots-clés dans le profil
- Titre de poste
- Et bien plus...

## 🚦 Gestion d'erreurs

- Validation côté client des champs obligatoires
- Gestion des erreurs réseau et API
- Messages d'erreur explicites en français
- Fallback gracieux en cas d'échec

## 📱 Responsive Design

L'interface s'adapte parfaitement à :
- Desktop (1200px+)
- Tablette (768px - 1199px)
- Mobile (< 768px)

## 🔐 Sécurité

- Validation des entrées utilisateur
- Protection contre les injections
- Gestion sécurisée des tokens API
- CORS configuré pour la production

## 🚀 Déploiement

Pour déployer en production :

1. Configurez les variables d'environnement
2. Remplacez les fonctions de simulation par les vrais appels MCP
3. Configurez un serveur web (nginx, Apache)
4. Utilisez un process manager (PM2, Docker)

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur le repository
- Consulter la documentation MCP Horizon Data Wave
- Vérifier les logs du serveur pour le débogage 