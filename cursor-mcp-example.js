// EXEMPLE D'UTILISATION DIRECTE DES OUTILS MCP HORIZON DATA WAVE DANS CURSOR
// =========================================================================
// Ce fichier montre comment utiliser les vrais outils MCP dans votre environnement Cursor

/**
 * Fonction principale de recherche LinkedIn utilisant les outils MCP
 * À utiliser directement dans votre environnement Cursor
 */
async function rechercherProfilsLinkedIn(nom, prenom, critere = null, valeurCritere = null) {
    try {
        console.log(`🔍 Recherche LinkedIn pour: ${prenom} ${nom}`);
        
        // Préparer les paramètres de recherche
        const parametresRecherche = {
            count: 10,
            first_name: prenom,
            last_name: nom,
            timeout: 300
        };

        // Ajouter le critère spécifique si fourni
        if (critere && valeurCritere) {
            switch (critere.toLowerCase()) {
                case 'entreprise':
                case 'company':
                    parametresRecherche.current_company = valeurCritere;
                    break;
                case 'localisation':
                case 'location':
                    parametresRecherche.location = valeurCritere;
                    break;
                case 'poste':
                case 'titre':
                case 'title':
                    parametresRecherche.title = valeurCritere;
                    break;
                case 'mots-cles':
                case 'keywords':
                    parametresRecherche.keywords = valeurCritere;
                    break;
            }
            console.log(`📌 Critère: ${critere} = ${valeurCritere}`);
        }

        // APPEL RÉEL AU MCP - Remplacez cette ligne par l'appel réel dans Cursor
        // const resultats = await mcp_hdw_search_linkedin_users(parametresRecherche);
        
        // Pour la démonstration, simulons les résultats
        console.log('⚠️  Mode démonstration - pour utiliser les vrais outils MCP:');
        console.log('   Remplacez cette section par: await mcp_hdw_search_linkedin_users(parametresRecherche)');
        
        const resultats = await simulerRechercheMCP(parametresRecherche);
        
        // Afficher les résultats
        console.log(`✅ Trouvé ${resultats.length} profil(s):`);
        resultats.forEach((profil, index) => {
            console.log(`\n${index + 1}. 👤 ${profil.first_name} ${profil.last_name}`);
            console.log(`   💼 ${profil.headline || 'Poste non spécifié'}`);
            console.log(`   🏢 ${profil.current_company || 'Entreprise non spécifiée'}`);
            console.log(`   📍 ${profil.location || 'Localisation non spécifiée'}`);
            if (profil.profile_url) {
                console.log(`   🔗 ${profil.profile_url}`);
            }
        });

        return resultats;
        
    } catch (erreur) {
        console.error('❌ Erreur lors de la recherche LinkedIn:', erreur);
        throw erreur;
    }
}

/**
 * Obtenir les détails complets d'un profil LinkedIn
 */
async function obtenirDetailsProfil(identifiantProfil) {
    try {
        console.log(`👤 Récupération des détails du profil: ${identifiantProfil}`);

        const parametres = {
            user: identifiantProfil,
            with_experience: true,
            with_education: true,
            with_skills: true
        };

        // APPEL RÉEL AU MCP - Remplacez cette ligne par l'appel réel dans Cursor
        // const profil = await mcp_hdw_get_linkedin_profile(parametres);
        
        console.log('⚠️  Mode démonstration - pour utiliser les vrais outils MCP:');
        console.log('   Remplacez cette section par: await mcp_hdw_get_linkedin_profile(parametres)');
        
        const profil = await simulerProfilDetailMCP(parametres);

        // Afficher les détails
        console.log('✅ Détails du profil récupérés:');
        console.log(`📛 Nom: ${profil.first_name} ${profil.last_name}`);
        console.log(`💼 Poste: ${profil.headline}`);
        console.log(`📍 Localisation: ${profil.location}`);
        console.log(`📝 Résumé: ${profil.summary?.substring(0, 200)}...`);
        
        if (profil.experience && profil.experience.length > 0) {
            console.log('\n💼 Expériences:');
            profil.experience.slice(0, 3).forEach((exp, index) => {
                console.log(`   ${index + 1}. ${exp.title} chez ${exp.company} (${exp.duration})`);
            });
        }

        if (profil.skills && profil.skills.length > 0) {
            console.log(`\n🛠️  Compétences: ${profil.skills.slice(0, 8).join(', ')}`);
        }

        return profil;
        
    } catch (erreur) {
        console.error('❌ Erreur lors de la récupération du profil:', erreur);
        throw erreur;
    }
}

/**
 * Recherche avancée avec Sales Navigator
 */
async function rechercheAvanceeSalesNavigator(criteres) {
    try {
        console.log('🎯 Recherche avancée Sales Navigator avec critères:', criteres);

        // APPEL RÉEL AU MCP - Remplacez cette ligne par l'appel réel dans Cursor
        // const resultats = await mcp_hdw_linkedin_sn_search_users(criteres);
        
        console.log('⚠️  Mode démonstration - pour utiliser les vrais outils MCP:');
        console.log('   Remplacez cette section par: await mcp_hdw_linkedin_sn_search_users(criteres)');
        
        const resultats = await simulerRechercheSalesNavMCP(criteres);

        console.log(`✅ Recherche avancée terminée - ${resultats.length} profil(s) trouvé(s)`);
        return resultats;
        
    } catch (erreur) {
        console.error('❌ Erreur lors de la recherche Sales Navigator:', erreur);
        throw erreur;
    }
}

/**
 * EXEMPLES D'UTILISATION PRATIQUE
 */
async function exemplesPratiques() {
    console.log('🚀 === EXEMPLES PRATIQUES D\'UTILISATION MCP ===\n');

    // Exemple 1: Recherche simple par nom
    console.log('📋 Exemple 1: Recherche par nom seulement');
    await rechercherProfilsLinkedIn('Dupont', 'Jean');
    console.log('\n' + '='.repeat(50) + '\n');

    // Exemple 2: Recherche par entreprise
    console.log('📋 Exemple 2: Recherche par entreprise');
    await rechercherProfilsLinkedIn('Martin', 'Marie', 'entreprise', 'Google');
    console.log('\n' + '='.repeat(50) + '\n');

    // Exemple 3: Recherche par localisation
    console.log('📋 Exemple 3: Recherche par localisation');
    await rechercherProfilsLinkedIn('Bernard', 'Pierre', 'localisation', 'Paris, France');
    console.log('\n' + '='.repeat(50) + '\n');

    // Exemple 4: Recherche par mots-clés
    console.log('📋 Exemple 4: Recherche par mots-clés');
    await rechercherProfilsLinkedIn('Durand', 'Sophie', 'mots-cles', 'JavaScript React');
    console.log('\n' + '='.repeat(50) + '\n');

    // Exemple 5: Obtenir détails d'un profil
    console.log('📋 Exemple 5: Détails d\'un profil');
    await obtenirDetailsProfil('urn:li:fsd_profile:ACoAAABExample1');
    console.log('\n' + '='.repeat(50) + '\n');

    // Exemple 6: Recherche avancée Sales Navigator
    console.log('📋 Exemple 6: Recherche avancée Sales Navigator');
    await rechercheAvanceeSalesNavigator({
        current_companies: ['Microsoft', 'Google'],
        location: ['Paris, France'],
        functions: ['Engineering'],
        levels: ['Senior', 'Director'],
        count: 5
    });
}

// FONCTIONS DE SIMULATION (À SUPPRIMER EN PRODUCTION)
async function simulerRechercheMCP(params) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        {
            first_name: params.first_name,
            last_name: params.last_name,
            headline: 'Développeur Full Stack Senior',
            current_company: params.current_company || 'Tech Innovation',
            location: params.location || 'Paris, France',
            profile_url: 'https://linkedin.com/in/exemple-profil'
        }
    ];
}

async function simulerProfilDetailMCP(params) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
        first_name: 'Jean',
        last_name: 'Dupont',
        headline: 'Développeur Full Stack Senior chez Tech Innovation',
        location: 'Paris, France',
        summary: 'Développeur expérimenté avec plus de 8 ans d\'expérience en développement web moderne.',
        experience: [
            { title: 'Développeur Senior', company: 'Tech Innovation', duration: '2022 - Présent' }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python']
    };
}

async function simulerRechercheSalesNavMCP(params) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return [
        {
            first_name: 'Marie',
            last_name: 'Dubois',
            headline: 'Senior Software Engineer',
            current_company: 'Microsoft',
            location: 'Paris, France'
        }
    ];
}

// INSTRUCTIONS POUR L'INTÉGRATION DANS CURSOR
console.log(`
🔧 INSTRUCTIONS D'INTÉGRATION MCP DANS CURSOR
=============================================

Pour utiliser les vrais outils MCP Horizon Data Wave dans votre environnement Cursor :

1. 📝 REMPLACER LES APPELS SIMULÉS :
   
   Remplacez:
   const resultats = await simulerRechercheMCP(parametres);
   
   Par:
   const resultats = await mcp_hdw_search_linkedin_users(parametres);

2. 🔑 OUTILS MCP DISPONIBLES :
   
   • mcp_hdw_search_linkedin_users(params)     - Recherche d'utilisateurs
   • mcp_hdw_get_linkedin_profile(params)      - Détails d'un profil  
   • mcp_hdw_get_linkedin_email_user(params)   - Recherche par email
   • mcp_hdw_linkedin_sn_search_users(params)  - Recherche Sales Navigator

3. 🎯 PARAMÈTRES DE RECHERCHE SUPPORTÉS :
   
   • first_name, last_name          - Nom et prénom
   • current_company, past_company  - Entreprise actuelle/précédente
   • location                       - Localisation géographique
   • title                         - Titre de poste
   • keywords                      - Mots-clés libres
   • industry                      - Secteur d'activité
   • count                         - Nombre de résultats (max)

4. 🔐 AUTHENTIFICATION :
   
   Assurez-vous que votre token LinkedIn est configuré dans l'environnement MCP.

5. ⚡ UTILISATION PRATIQUE :
   
   // Recherche simple
   const profils = await mcp_hdw_search_linkedin_users({
       first_name: 'Jean',
       last_name: 'Dupont',
       current_company: 'Google',
       count: 5
   });

   // Détails d'un profil
   const details = await mcp_hdw_get_linkedin_profile({
       user: 'profil-url-ou-urn',
       with_experience: true,
       with_skills: true
   });

📚 Consultez la documentation complète des outils MCP pour plus d'options.
`);

// Exporter les fonctions pour utilisation
module.exports = {
    rechercherProfilsLinkedIn,
    obtenirDetailsProfil,
    rechercheAvanceeSalesNavigator,
    exemplesPratiques
};

// Exécuter les exemples si appelé directement
if (require.main === module) {
    exemplesPratiques().catch(console.error);
} 