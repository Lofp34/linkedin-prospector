// Script de démonstration utilisant directement les outils MCP Horizon Data Wave
// Ce script montre comment faire des recherches LinkedIn avec les vrais outils MCP

const { LinkedInMCPIntegration } = require('./mcp-integration');

class LinkedInSearchDemo {
    constructor() {
        this.mcpIntegration = new LinkedInMCPIntegration();
    }

    /**
     * Démonstration de recherche LinkedIn complète
     */
    async runFullDemo() {
        console.log('🚀 === DÉMONSTRATION LINKEDIN SEARCH MCP ===\n');

        try {
            // 1. Recherche basique par nom
            await this.demoBasicSearch();
            
            // 2. Recherche par entreprise
            await this.demoCompanySearch();
            
            // 3. Recherche par localisation
            await this.demoLocationSearch();
            
            // 4. Recherche par mots-clés
            await this.demoKeywordSearch();
            
            // 5. Récupération de profil détaillé
            await this.demoProfileDetails();
            
            // 6. Recherche par email
            await this.demoEmailSearch();
            
            // 7. Recherche avancée Sales Navigator
            await this.demoSalesNavigatorSearch();

        } catch (error) {
            console.error('❌ Erreur lors de la démonstration:', error);
        }
    }

    /**
     * Démonstration de recherche basique par nom
     */
    async demoBasicSearch() {
        console.log('🔍 1. RECHERCHE BASIQUE PAR NOM');
        console.log('================================');
        
        const searchParams = {
            firstName: 'Jean',
            lastName: 'Dupont',
            searchType: 'basic',
            resultCount: 5
        };

        try {
            const results = await this.mcpIntegration.searchLinkedInUsers(searchParams);
            
            console.log(`✅ Trouvé ${results.length} profil(s) :`);
            results.forEach((profile, index) => {
                console.log(`   ${index + 1}. ${profile.firstName} ${profile.lastName}`);
                console.log(`      📍 ${profile.location}`);
                console.log(`      🏢 ${profile.company}`);
                console.log(`      💼 ${profile.headline}`);
                console.log('');
            });
            
        } catch (error) {
            console.error('❌ Erreur recherche basique:', error.message);
        }
        
        console.log('---\n');
    }

    /**
     * Démonstration de recherche par entreprise
     */
    async demoCompanySearch() {
        console.log('🏢 2. RECHERCHE PAR ENTREPRISE');
        console.log('==============================');
        
        const searchParams = {
            firstName: 'Marie',
            lastName: 'Martin',
            searchType: 'company',
            searchValue: 'Google',
            resultCount: 3
        };

        try {
            const results = await this.mcpIntegration.searchLinkedInUsers(searchParams);
            
            console.log(`✅ Trouvé ${results.length} profil(s) chez Google :`);
            results.forEach((profile, index) => {
                console.log(`   ${index + 1}. ${profile.firstName} ${profile.lastName}`);
                console.log(`      🎯 ${profile.headline}`);
                console.log(`      🔗 ${profile.profileUrl}`);
                console.log('');
            });
            
        } catch (error) {
            console.error('❌ Erreur recherche par entreprise:', error.message);
        }
        
        console.log('---\n');
    }

    /**
     * Démonstration de recherche par localisation
     */
    async demoLocationSearch() {
        console.log('📍 3. RECHERCHE PAR LOCALISATION');
        console.log('=================================');
        
        const searchParams = {
            firstName: 'Pierre',
            lastName: 'Durand',
            searchType: 'location',
            searchValue: 'Paris, France',
            resultCount: 4
        };

        try {
            const results = await this.mcpIntegration.searchLinkedInUsers(searchParams);
            
            console.log(`✅ Trouvé ${results.length} profil(s) à Paris :`);
            results.forEach((profile, index) => {
                console.log(`   ${index + 1}. ${profile.firstName} ${profile.lastName}`);
                console.log(`      🏢 ${profile.company}`);
                console.log(`      🌐 ${profile.industry}`);
                console.log(`      👥 ${profile.connections} connexions`);
                console.log('');
            });
            
        } catch (error) {
            console.error('❌ Erreur recherche par localisation:', error.message);
        }
        
        console.log('---\n');
    }

    /**
     * Démonstration de recherche par mots-clés
     */
    async demoKeywordSearch() {
        console.log('🔑 4. RECHERCHE PAR MOTS-CLÉS');
        console.log('==============================');
        
        const searchParams = {
            firstName: 'Sophie',
            lastName: 'Bernard',
            searchType: 'keywords',
            searchValue: 'JavaScript React',
            resultCount: 3
        };

        try {
            const results = await this.mcpIntegration.searchLinkedInUsers(searchParams);
            
            console.log(`✅ Trouvé ${results.length} développeur(s) JavaScript/React :`);
            results.forEach((profile, index) => {
                console.log(`   ${index + 1}. ${profile.firstName} ${profile.lastName}`);
                console.log(`      💻 ${profile.headline}`);
                console.log(`      📝 ${profile.summary.substring(0, 100)}...`);
                console.log('');
            });
            
        } catch (error) {
            console.error('❌ Erreur recherche par mots-clés:', error.message);
        }
        
        console.log('---\n');
    }

    /**
     * Démonstration de récupération de profil détaillé
     */
    async demoProfileDetails() {
        console.log('👤 5. DÉTAILS COMPLETS DE PROFIL');
        console.log('=================================');
        
        const profileUrn = 'urn:li:fsd_profile:ACoAAABExample1';

        try {
            const profile = await this.mcpIntegration.getLinkedInProfile(profileUrn);
            
            console.log('✅ Profil détaillé récupéré :');
            console.log(`   📛 ${profile.firstName} ${profile.lastName}`);
            console.log(`   💼 ${profile.headline}`);
            console.log(`   📍 ${profile.location}`);
            console.log(`   📝 ${profile.summary.substring(0, 150)}...`);
            
            if (profile.experience && profile.experience.length > 0) {
                console.log('   💼 Expériences :');
                profile.experience.slice(0, 2).forEach((exp, index) => {
                    console.log(`      ${index + 1}. ${exp.title} chez ${exp.company}`);
                    console.log(`         📅 ${exp.duration}`);
                });
            }
            
            if (profile.skills && profile.skills.length > 0) {
                console.log(`   🛠️  Compétences : ${profile.skills.slice(0, 5).join(', ')}`);
            }
            
            console.log('');
            
        } catch (error) {
            console.error('❌ Erreur récupération profil:', error.message);
        }
        
        console.log('---\n');
    }

    /**
     * Démonstration de recherche par email
     */
    async demoEmailSearch() {
        console.log('📧 6. RECHERCHE PAR EMAIL');
        console.log('=========================');
        
        const email = 'jean.dupont@tech-innovation.com';

        try {
            const results = await this.mcpIntegration.searchByEmail(email);
            
            console.log(`✅ Trouvé ${results.length} profil(s) pour l'email ${email} :`);
            results.forEach((profile, index) => {
                console.log(`   ${index + 1}. ${profile.firstName} ${profile.lastName}`);
                console.log(`      🏢 ${profile.company}`);
                console.log(`      🔗 ${profile.profileUrl}`);
                console.log('');
            });
            
        } catch (error) {
            console.error('❌ Erreur recherche par email:', error.message);
        }
        
        console.log('---\n');
    }

    /**
     * Démonstration de recherche avancée Sales Navigator
     */
    async demoSalesNavigatorSearch() {
        console.log('🎯 7. RECHERCHE AVANCÉE SALES NAVIGATOR');
        console.log('=======================================');
        
        const advancedParams = {
            current_companies: ['Google', 'Microsoft', 'Apple'],
            location: ['Paris, France', 'Lyon, France'],
            functions: ['Engineering', 'Information Technology'],
            levels: ['Senior', 'Director'],
            count: 5
        };

        try {
            const results = await this.mcpIntegration.salesNavigatorSearch(advancedParams);
            
            console.log(`✅ Trouvé ${results.length} profil(s) avec critères avancés :`);
            results.forEach((profile, index) => {
                console.log(`   ${index + 1}. ${profile.firstName} ${profile.lastName}`);
                console.log(`      🎯 ${profile.headline}`);
                console.log(`      📍 ${profile.location}`);
                console.log(`      🏢 ${profile.company}`);
                console.log('');
            });
            
        } catch (error) {
            console.error('❌ Erreur recherche Sales Navigator:', error.message);
        }
        
        console.log('---\n');
    }

    /**
     * Démonstration interactive avec saisie utilisateur
     */
    async runInteractiveDemo() {
        console.log('🔄 === DÉMONSTRATION INTERACTIVE ===\n');
        
        // Note: Pour une vraie interaction, vous devriez utiliser readline ou inquirer
        const searchParams = {
            firstName: 'Laurent',
            lastName: 'Smith',
            searchType: 'company',
            searchValue: 'Tech Innovation',
            resultCount: 3
        };

        console.log('Simulation de recherche interactive avec les paramètres :');
        console.log(JSON.stringify(searchParams, null, 2));
        console.log('');

        try {
            const results = await this.mcpIntegration.searchLinkedInUsers(searchParams);
            
            console.log('🎉 Résultats de la recherche interactive :');
            results.forEach((profile, index) => {
                console.log(`\n${index + 1}. 👤 ${profile.firstName} ${profile.lastName}`);
                console.log(`   💼 ${profile.headline}`);
                console.log(`   🏢 ${profile.company}`);
                console.log(`   📍 ${profile.location}`);
                console.log(`   🔗 ${profile.profileUrl}`);
                if (profile.summary) {
                    console.log(`   📝 ${profile.summary.substring(0, 100)}...`);
                }
            });
            
        } catch (error) {
            console.error('❌ Erreur lors de la démonstration interactive:', error.message);
        }
    }
}

// Fonction principale pour exécuter la démonstration
async function main() {
    const demo = new LinkedInSearchDemo();
    
    // Exécuter la démonstration complète
    await demo.runFullDemo();
    
    // Exécuter la démonstration interactive
    await demo.runInteractiveDemo();
    
    console.log('✨ Démonstration terminée !');
    console.log('\n📚 Pour utiliser les vrais outils MCP dans Cursor :');
    console.log('   1. Remplacez les appels simulés par les vrais outils MCP');
    console.log('   2. Configurez vos tokens d\'authentification LinkedIn');
    console.log('   3. Respectez les limites de taux de l\'API');
    console.log('   4. Gérez les erreurs appropriément');
}

// Exporter pour utilisation dans d'autres modules
module.exports = {
    LinkedInSearchDemo,
    main
};

// Exécuter si appelé directement
if (require.main === module) {
    main().catch(console.error);
} 