// APPLICATION RÉELLE LINKEDIN SEARCH AVEC MCP HORIZON DATA WAVE
// ===========================================================
// Cette application utilise les vrais outils MCP dans l'environnement Cursor

class RealLinkedInSearch {
    constructor() {
        this.searchHistory = [];
        this.lastSearchTime = null;
    }

    /**
     * Recherche réelle de profils LinkedIn
     * @param {string} firstName - Prénom
     * @param {string} lastName - Nom de famille  
     * @param {Object} options - Options de recherche
     */
    async searchProfiles(firstName, lastName, options = {}) {
        try {
            console.log(`🔍 RECHERCHE RÉELLE LINKEDIN: ${firstName} ${lastName}`);
            
            // Préparer les paramètres MCP
            const mcpParams = {
                first_name: firstName,
                last_name: lastName,
                count: options.count || 10,
                timeout: options.timeout || 300,
                ...options
            };

            console.log('📋 Paramètres envoyés:', JSON.stringify(mcpParams, null, 2));

            // APPEL RÉEL À L'OUTIL MCP
            const results = await mcp_hdw_search_linkedin_users(mcpParams);
            
            // Enregistrer dans l'historique
            this.searchHistory.push({
                timestamp: new Date(),
                params: mcpParams,
                resultCount: results.length
            });
            this.lastSearchTime = new Date();

            console.log(`✅ RÉSULTATS TROUVÉS: ${results.length} profil(s)`);
            
            // Afficher les résultats
            this.displayResults(results);
            
            return results;

        } catch (error) {
            console.error('❌ ERREUR RECHERCHE MCP:', error);
            throw error;
        }
    }

    /**
     * Obtenir les détails complets d'un profil
     * @param {string} userIdentifier - URL, URN ou alias LinkedIn
     */
    async getProfileDetails(userIdentifier) {
        try {
            console.log(`👤 RÉCUPÉRATION PROFIL RÉEL: ${userIdentifier}`);

            const mcpParams = {
                user: userIdentifier,
                with_experience: true,
                with_education: true,
                with_skills: true
            };

            // APPEL RÉEL À L'OUTIL MCP
            const profile = await mcp_hdw_get_linkedin_profile(mcpParams);
            
            console.log('✅ PROFIL RÉCUPÉRÉ AVEC SUCCÈS');
            this.displayProfileDetails(profile);
            
            return profile;

        } catch (error) {
            console.error('❌ ERREUR RÉCUPÉRATION PROFIL:', error);
            throw error;
        }
    }

    /**
     * Recherche par email
     * @param {string} email - Adresse email
     */
    async searchByEmail(email) {
        try {
            console.log(`📧 RECHERCHE PAR EMAIL: ${email}`);

            const mcpParams = {
                email: email,
                count: 5,
                timeout: 300
            };

            // APPEL RÉEL À L'OUTIL MCP
            const results = await mcp_hdw_get_linkedin_email_user(mcpParams);
            
            console.log(`✅ TROUVÉ ${results.length} profil(s) pour ${email}`);
            this.displayResults(results);
            
            return results;

        } catch (error) {
            console.error('❌ ERREUR RECHERCHE EMAIL:', error);
            throw error;
        }
    }

    /**
     * Recherche avancée Sales Navigator
     * @param {Object} criteria - Critères de recherche avancée
     */
    async salesNavigatorSearch(criteria) {
        try {
            console.log('🎯 RECHERCHE SALES NAVIGATOR RÉELLE');
            console.log('Critères:', JSON.stringify(criteria, null, 2));

            // APPEL RÉEL À L'OUTIL MCP
            const results = await mcp_hdw_linkedin_sn_search_users(criteria);
            
            console.log(`✅ SALES NAV: ${results.length} profil(s) trouvé(s)`);
            this.displayResults(results);
            
            return results;

        } catch (error) {
            console.error('❌ ERREUR SALES NAVIGATOR:', error);
            throw error;
        }
    }

    /**
     * Afficher les résultats de recherche
     */
    displayResults(results) {
        if (!results || results.length === 0) {
            console.log('🚫 Aucun résultat trouvé');
            return;
        }

        console.log('\n📊 === RÉSULTATS DE RECHERCHE ===');
        results.forEach((profile, index) => {
            console.log(`\n${index + 1}. 👤 ${profile.first_name || profile.firstName || 'N/A'} ${profile.last_name || profile.lastName || 'N/A'}`);
            console.log(`   💼 ${profile.headline || profile.current_position || 'Poste non spécifié'}`);
            console.log(`   🏢 ${profile.current_company || profile.company || 'Entreprise non spécifiée'}`);
            console.log(`   📍 ${profile.location || 'Localisation non spécifiée'}`);
            console.log(`   👥 ${profile.connections || 'N/A'} connexions`);
            
            if (profile.profile_url || profile.linkedin_url) {
                console.log(`   🔗 ${profile.profile_url || profile.linkedin_url}`);
            }
            
            if (profile.urn) {
                console.log(`   🆔 URN: ${profile.urn}`);
            }
        });
        console.log('\n' + '='.repeat(40));
    }

    /**
     * Afficher les détails d'un profil
     */
    displayProfileDetails(profile) {
        console.log('\n👤 === DÉTAILS DU PROFIL ===');
        console.log(`📛 Nom: ${profile.first_name || profile.firstName} ${profile.last_name || profile.lastName}`);
        console.log(`💼 Poste: ${profile.headline || profile.current_position}`);
        console.log(`📍 Localisation: ${profile.location}`);
        
        if (profile.summary) {
            console.log(`📝 Résumé: ${profile.summary.substring(0, 200)}...`);
        }

        if (profile.experience && profile.experience.length > 0) {
            console.log('\n💼 EXPÉRIENCES:');
            profile.experience.slice(0, 3).forEach((exp, index) => {
                console.log(`   ${index + 1}. ${exp.title || exp.position} chez ${exp.company}`);
                console.log(`      📅 ${exp.duration || exp.period || 'Période non spécifiée'}`);
                if (exp.description) {
                    console.log(`      📝 ${exp.description.substring(0, 100)}...`);
                }
            });
        }

        if (profile.education && profile.education.length > 0) {
            console.log('\n🎓 FORMATION:');
            profile.education.slice(0, 2).forEach((edu, index) => {
                console.log(`   ${index + 1}. ${edu.degree || edu.diploma} - ${edu.school || edu.institution}`);
                console.log(`      📅 ${edu.years || edu.period || 'Période non spécifiée'}`);
            });
        }

        if (profile.skills && profile.skills.length > 0) {
            console.log(`\n🛠️ COMPÉTENCES: ${profile.skills.slice(0, 10).join(', ')}`);
        }

        if (profile.languages && profile.languages.length > 0) {
            console.log(`\n🌐 LANGUES: ${profile.languages.join(', ')}`);
        }

        console.log('\n' + '='.repeat(40));
    }

    /**
     * Recherche avec critères multiples
     */
    async searchWithCriteria(firstName, lastName, company = null, location = null, title = null, keywords = null) {
        const options = {};
        
        if (company) options.current_company = company;
        if (location) options.location = location;
        if (title) options.title = title;
        if (keywords) options.keywords = keywords;

        return await this.searchProfiles(firstName, lastName, options);
    }

    /**
     * Obtenir l'historique des recherches
     */
    getSearchHistory() {
        console.log('\n📈 === HISTORIQUE DES RECHERCHES ===');
        this.searchHistory.forEach((search, index) => {
            console.log(`${index + 1}. ${search.timestamp.toLocaleString()}`);
            console.log(`   Nom: ${search.params.first_name} ${search.params.last_name}`);
            console.log(`   Résultats: ${search.resultCount}`);
            if (search.params.current_company) {
                console.log(`   Entreprise: ${search.params.current_company}`);
            }
            if (search.params.location) {
                console.log(`   Localisation: ${search.params.location}`);
            }
            console.log('');
        });
        return this.searchHistory;
    }
}

// Fonctions utilitaires pour utilisation directe
async function rechercheRapide(prenom, nom, entreprise = null, ville = null) {
    const searcher = new RealLinkedInSearch();
    return await searcher.searchWithCriteria(prenom, nom, entreprise, ville);
}

async function profilDetaille(identifiant) {
    const searcher = new RealLinkedInSearch();
    return await searcher.getProfileDetails(identifiant);
}

async function rechercheEmail(email) {
    const searcher = new RealLinkedInSearch();
    return await searcher.searchByEmail(email);
}

async function rechercheAvancee(criteres) {
    const searcher = new RealLinkedInSearch();
    return await searcher.salesNavigatorSearch(criteres);
}

// Export pour utilisation
module.exports = {
    RealLinkedInSearch,
    rechercheRapide,
    profilDetaille,
    rechercheEmail,
    rechercheAvancee
};

// Auto-exécution si fichier appelé directement
if (require.main === module) {
    async function demo() {
        console.log('🚀 === DÉMONSTRATION RECHERCHE LINKEDIN RÉELLE ===\n');
        
        const searcher = new RealLinkedInSearch();
        
        try {
            // Test recherche basique
            console.log('🔍 Test 1: Recherche basique');
            await searcher.searchProfiles('Jean', 'Dupont', { count: 3 });
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Test recherche avec entreprise
            console.log('\n🏢 Test 2: Recherche avec entreprise');
            await searcher.searchWithCriteria('Marie', 'Martin', 'Google', null);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Test recherche par email
            console.log('\n📧 Test 3: Recherche par email');
            await searcher.searchByEmail('jean.dupont@google.com');
            
            // Afficher l'historique
            searcher.getSearchHistory();
            
        } catch (error) {
            console.error('Erreur lors de la démonstration:', error);
        }
    }
    
    demo();
} 