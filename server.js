// Serveur Node.js pour gérer les appels aux outils MCP Horizon Data Wave
// Note: Ce serveur est une démonstration - en production vous devriez utiliser
// les outils MCP directement dans votre environnement Cursor

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Route pour servir l'application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route API pour la recherche LinkedIn
app.post('/api/search-linkedin', async (req, res) => {
    try {
        const { firstName, lastName, searchType, searchValue, resultCount } = req.body;
        
        console.log('Recherche LinkedIn avec les paramètres:', req.body);
        
        // Préparer les options de recherche
        const searchOptions = {
            count: resultCount || 10,
            first_name: firstName,
            last_name: lastName
        };

        // Ajouter les paramètres spécifiques selon le type de recherche
        switch (searchType) {
            case 'company':
                if (searchValue) {
                    searchOptions.current_company = searchValue;
                }
                break;
            case 'location':
                if (searchValue) {
                    searchOptions.location = searchValue;
                }
                break;
            case 'title':
                if (searchValue) {
                    searchOptions.title = searchValue;
                }
                break;
            case 'keywords':
                if (searchValue) {
                    searchOptions.keywords = searchValue;
                }
                break;
        }

        // TODO: Remplacer par l'appel réel aux outils MCP
        // const results = await callMCPLinkedInSearch(searchOptions);
        
        // Pour la démonstration, retourner des données fictives
        const mockResults = await simulateLinkedInSearch(searchOptions);
        
        res.json({
            success: true,
            results: mockResults,
            searchParams: searchOptions
        });
        
    } catch (error) {
        console.error('Erreur lors de la recherche LinkedIn:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la recherche LinkedIn',
            message: error.message
        });
    }
});

// Route API pour obtenir les détails d'un profil
app.get('/api/profile/:profileId', async (req, res) => {
    try {
        const { profileId } = req.params;
        
        console.log('Récupération du profil:', profileId);
        
        // TODO: Remplacer par l'appel réel à mcp_hdw_get_linkedin_profile
        // const profile = await callMCPGetProfile(profileId);
        
        const mockProfile = await simulateProfileDetails(profileId);
        
        res.json({
            success: true,
            profile: mockProfile
        });
        
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du profil',
            message: error.message
        });
    }
});

// Fonction pour simuler la recherche LinkedIn (à remplacer par l'outil MCP réel)
async function simulateLinkedInSearch(options) {
    // Simuler un délai de recherche
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResults = [
        {
            firstName: options.first_name,
            lastName: options.last_name,
            headline: "Développeur Full Stack chez Tech Innovation",
            location: options.location || "Paris, France",
            company: options.current_company || "Tech Innovation",
            profileUrl: "https://linkedin.com/in/example1",
            summary: "Expert en développement web moderne avec 7 ans d'expérience. Spécialisé en React, Node.js, et architectures cloud.",
            connections: "500+",
            industry: "Technologie de l'information",
            experience: [
                {
                    title: "Développeur Senior Full Stack",
                    company: "Tech Innovation",
                    duration: "2022 - Présent",
                    location: "Paris, France"
                },
                {
                    title: "Développeur Web",
                    company: "Digital Solutions",
                    duration: "2019 - 2022",
                    location: "Lyon, France"
                }
            ],
            education: [
                {
                    school: "École Supérieure d'Informatique",
                    degree: "Master en Informatique",
                    years: "2017 - 2019"
                }
            ],
            skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"]
        },
        {
            firstName: options.first_name,
            lastName: options.last_name + "ski",
            headline: "Chef de Projet Digital chez Innovation Labs",
            location: "Lyon, France",
            company: "Innovation Labs",
            profileUrl: "https://linkedin.com/in/example2",
            summary: "Leader expérimenté en transformation digitale et gestion d'équipes agiles. 10 ans d'expérience en management de projets technologiques.",
            connections: "750+",
            industry: "Conseil en management",
            experience: [
                {
                    title: "Chef de Projet Senior",
                    company: "Innovation Labs",
                    duration: "2020 - Présent",
                    location: "Lyon, France"
                }
            ],
            education: [
                {
                    school: "ESSEC Business School",
                    degree: "MBA",
                    years: "2015 - 2017"
                }
            ],
            skills: ["Gestion de projet", "Agile", "Scrum", "Leadership", "Transformation digitale"]
        }
    ];
    
    // Filtrer selon les critères si nécessaire
    let filteredResults = mockResults;
    
    if (options.title) {
        filteredResults = filteredResults.filter(profile => 
            profile.headline.toLowerCase().includes(options.title.toLowerCase())
        );
    }
    
    if (options.keywords) {
        filteredResults = filteredResults.filter(profile => 
            profile.summary.toLowerCase().includes(options.keywords.toLowerCase()) ||
            profile.skills.some(skill => skill.toLowerCase().includes(options.keywords.toLowerCase()))
        );
    }
    
    return filteredResults.slice(0, options.count);
}

// Fonction pour simuler les détails d'un profil
async function simulateProfileDetails(profileId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        id: profileId,
        firstName: "Jean",
        lastName: "Dupont",
        headline: "Développeur Full Stack chez Tech Innovation",
        location: "Paris, France",
        summary: "Développeur passionné avec plus de 7 ans d'expérience dans le développement d'applications web modernes...",
        experience: [
            {
                title: "Développeur Senior Full Stack",
                company: "Tech Innovation",
                duration: "Jan 2022 - Présent",
                description: "Développement d'applications React/Node.js, architecture microservices, leadership technique d'une équipe de 5 développeurs."
            }
        ],
        education: [
            {
                school: "École Supérieure d'Informatique de Paris",
                degree: "Master en Génie Logiciel",
                years: "2015 - 2017"
            }
        ],
        skills: ["JavaScript", "React", "Node.js", "Python", "Docker", "AWS"],
        languages: ["Français (Natif)", "Anglais (Courant)", "Espagnol (Intermédiaire)"],
        certifications: [
            "AWS Certified Developer",
            "React Developer Certification"
        ]
    };
}

// Documentation des outils MCP disponibles
const mcpToolsDocumentation = `
Outils MCP Horizon Data Wave disponibles:

1. mcp_hdw_search_linkedin_users - Rechercher des utilisateurs LinkedIn
   Paramètres: first_name, last_name, keywords, current_company, location, title, etc.

2. mcp_hdw_get_linkedin_profile - Obtenir les détails d'un profil LinkedIn
   Paramètres: user (alias, URL ou URN)

3. mcp_hdw_get_linkedin_email_user - Rechercher un utilisateur par email
   Paramètres: email

4. mcp_hdw_linkedin_sn_search_users - Recherche avancée avec Sales Navigator
   Paramètres: current_companies, location, functions, levels, etc.

Pour utiliser ces outils en production, remplacez les fonctions simulate* 
par les vrais appels aux outils MCP dans votre environnement Cursor.
`;

app.get('/api/mcp-docs', (req, res) => {
    res.json({
        documentation: mcpToolsDocumentation,
        availableTools: [
            'mcp_hdw_search_linkedin_users',
            'mcp_hdw_get_linkedin_profile', 
            'mcp_hdw_get_linkedin_email_user',
            'mcp_hdw_linkedin_sn_search_users'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur LinkedIn Search App démarré sur http://localhost:${PORT}`);
    console.log('📚 Documentation MCP disponible sur /api/mcp-docs');
});

module.exports = app; 