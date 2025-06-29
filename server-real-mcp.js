const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Historique des recherches
let searchHistory = [];

// Route pour rechercher des profils LinkedIn
app.post('/api/search-linkedin', async (req, res) => {
    try {
        const { firstName, lastName, company, location, title, keywords, count = 10 } = req.body;
        
        console.log('🔍 RECHERCHE RÉELLE LINKEDIN:', { firstName, lastName, company, location });
        
        // Validation
        if (!firstName || !lastName) {
            return res.status(400).json({ 
                error: 'Le prénom et le nom sont obligatoires' 
            });
        }

        // Préparer les paramètres MCP
        const mcpParams = {
            first_name: firstName,
            last_name: lastName,
            count: parseInt(count),
            timeout: 300
        };

        // Ajouter les paramètres optionnels
        if (company) mcpParams.current_company = company;
        if (location) mcpParams.location = location;
        if (title) mcpParams.title = title;
        if (keywords) mcpParams.keywords = keywords;

        console.log('📋 Paramètres MCP:', mcpParams);

        // APPEL RÉEL À L'OUTIL MCP
        const results = await mcp_hdw_search_linkedin_users(mcpParams);
        
        // Sauvegarder dans l'historique
        searchHistory.push({
            timestamp: new Date(),
            params: mcpParams,
            resultCount: results.length
        });

        console.log(`✅ TROUVÉ ${results.length} profil(s)`);

        res.json({
            success: true,
            results: results,
            count: results.length,
            searchParams: mcpParams
        });

    } catch (error) {
        console.error('❌ ERREUR RECHERCHE MCP:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la recherche LinkedIn',
            details: error.message 
        });
    }
});

// Route pour obtenir les détails d'un profil
app.post('/api/profile-details', async (req, res) => {
    try {
        const { userIdentifier } = req.body;
        
        if (!userIdentifier) {
            return res.status(400).json({ 
                error: 'Identifiant utilisateur requis' 
            });
        }

        console.log('👤 RÉCUPÉRATION PROFIL:', userIdentifier);

        // APPEL RÉEL À L'OUTIL MCP
        const profile = await mcp_hdw_get_linkedin_profile({
            user: userIdentifier,
            with_experience: true,
            with_education: true,
            with_skills: true
        });

        console.log('✅ PROFIL RÉCUPÉRÉ');

        res.json({
            success: true,
            profile: profile[0] || profile
        });

    } catch (error) {
        console.error('❌ ERREUR PROFIL:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération du profil',
            details: error.message 
        });
    }
});

// Route pour recherche par email
app.post('/api/search-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                error: 'Email requis' 
            });
        }

        console.log('📧 RECHERCHE PAR EMAIL:', email);

        // APPEL RÉEL À L'OUTIL MCP
        const results = await mcp_hdw_get_linkedin_email_user({
            email: email,
            count: 5,
            timeout: 300
        });

        console.log(`✅ TROUVÉ ${results.length} profil(s) pour ${email}`);

        res.json({
            success: true,
            results: results,
            count: results.length
        });

    } catch (error) {
        console.error('❌ ERREUR RECHERCHE EMAIL:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la recherche par email',
            details: error.message 
        });
    }
});

// Route pour recherche avancée Sales Navigator
app.post('/api/search-advanced', async (req, res) => {
    try {
        const criteria = req.body;
        
        console.log('🎯 RECHERCHE SALES NAVIGATOR:', criteria);

        // APPEL RÉEL À L'OUTIL MCP
        const results = await mcp_hdw_linkedin_sn_search_users(criteria);

        console.log(`✅ SALES NAV: ${results.length} profil(s)`);

        res.json({
            success: true,
            results: results,
            count: results.length
        });

    } catch (error) {
        console.error('❌ ERREUR SALES NAVIGATOR:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la recherche avancée',
            details: error.message 
        });
    }
});

// Route pour l'historique des recherches
app.get('/api/search-history', (req, res) => {
    res.json({
        success: true,
        history: searchHistory.slice(-20) // Dernières 20 recherches
    });
});

// Route pour les statistiques
app.get('/api/stats', (req, res) => {
    const totalSearches = searchHistory.length;
    const today = new Date().toDateString();
    const todaySearches = searchHistory.filter(s => 
        s.timestamp.toDateString() === today
    ).length;
    
    res.json({
        success: true,
        stats: {
            totalSearches,
            todaySearches,
            lastSearch: searchHistory[searchHistory.length - 1]?.timestamp
        }
    });
});

// Page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index-real.html'));
});

// Route de test MCP
app.get('/api/test-mcp', async (req, res) => {
    try {
        console.log('🧪 TEST MCP HORIZON DATA WAVE');
        
        // Test simple
        const testResults = await mcp_hdw_search_linkedin_users({
            first_name: 'Test',
            last_name: 'User',
            count: 1,
            timeout: 300
        });

        res.json({
            success: true,
            message: 'Outils MCP fonctionnels',
            testResults: testResults
        });

    } catch (error) {
        console.error('❌ ERREUR TEST MCP:', error);
        res.status(500).json({ 
            error: 'Erreur lors du test MCP',
            details: error.message 
        });
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 SERVEUR LINKEDIN RÉEL DÉMARRÉ sur http://localhost:${PORT}`);
    console.log('🔧 Outils MCP Horizon Data Wave intégrés');
    console.log('📱 Interface web disponible à la racine');
    console.log('📊 API disponible sur /api/*');
});

module.exports = app; 