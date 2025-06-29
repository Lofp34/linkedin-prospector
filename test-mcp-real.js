// TEST DIRECT DES OUTILS MCP HORIZON DATA WAVE
// ============================================
// Ce fichier peut être utilisé directement dans votre environnement Cursor
// pour tester les outils MCP LinkedIn

/**
 * Test de recherche LinkedIn avec les vrais outils MCP
 * Utilisez ce fichier dans votre environnement Cursor
 */
async function testerRechercheMCP() {
    console.log('🧪 TEST DES OUTILS MCP HORIZON DATA WAVE\n');

    try {
        // Test 1: Recherche basique d'utilisateurs LinkedIn
        console.log('🔍 Test 1: Recherche d\'utilisateurs LinkedIn');
        console.log('='.repeat(50));
        
        const parametresRecherche = {
            first_name: "Jean",
            last_name: "Dupont", 
            current_company: "Google",
            location: "Paris, France",
            count: 3,
            timeout: 300
        };

        console.log('Paramètres de recherche:', JSON.stringify(parametresRecherche, null, 2));
        console.log('\n🚀 Lancement de la recherche...');

        // REMPLACEZ CETTE LIGNE PAR L'APPEL RÉEL DANS CURSOR :
        // const resultats = await mcp_hdw_search_linkedin_users(parametresRecherche);
        
        console.log('⚠️  Pour utiliser dans Cursor, remplacez par:');
        console.log('   const resultats = await mcp_hdw_search_linkedin_users(parametresRecherche);');
        
        // Exemple de structure de réponse attendue
        const resultatsExemple = [
            {
                "first_name": "Jean",
                "last_name": "Dupont",
                "headline": "Senior Software Engineer at Google",
                "location": "Paris, France",
                "current_company": "Google",
                "profile_url": "https://linkedin.com/in/jean-dupont-google",
                "summary": "Experienced software engineer with 10+ years in tech...",
                "connections": "500+",
                "industry": "Technology",
                "urn": "urn:li:fsd_profile:ACoAAExample123"
            }
        ];

        console.log('\n✅ Exemple de résultat attendu:');
        console.log(JSON.stringify(resultatsExemple[0], null, 2));

    } catch (error) {
        console.error('❌ Erreur lors du test de recherche:', error);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    try {
        // Test 2: Récupération de profil détaillé
        console.log('👤 Test 2: Récupération de profil détaillé');
        console.log('='.repeat(50));
        
        const parametresProfil = {
            user: "jean-dupont-google", // ou une URL complète ou URN
            with_experience: true,
            with_education: true,
            with_skills: true
        };

        console.log('Paramètres de profil:', JSON.stringify(parametresProfil, null, 2));
        console.log('\n🚀 Récupération du profil...');

        // REMPLACEZ CETTE LIGNE PAR L'APPEL RÉEL DANS CURSOR :
        // const profil = await mcp_hdw_get_linkedin_profile(parametresProfil);
        
        console.log('⚠️  Pour utiliser dans Cursor, remplacez par:');
        console.log('   const profil = await mcp_hdw_get_linkedin_profile(parametresProfil);');
        
        // Exemple de profil détaillé
        const profilExemple = {
            "first_name": "Jean",
            "last_name": "Dupont",
            "headline": "Senior Software Engineer at Google",
            "location": "Paris, France",
            "summary": "Experienced software engineer passionate about building scalable applications...",
            "experience": [
                {
                    "title": "Senior Software Engineer",
                    "company": "Google",
                    "duration": "2020 - Present",
                    "location": "Paris, France",
                    "description": "Leading development of cloud-based solutions..."
                }
            ],
            "education": [
                {
                    "school": "École Polytechnique",
                    "degree": "Master in Computer Science",
                    "years": "2016 - 2018"
                }
            ],
            "skills": ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker"],
            "languages": ["French (Native)", "English (Fluent)"],
            "connections": "500+"
        };

        console.log('\n✅ Exemple de profil détaillé:');
        console.log(JSON.stringify(profilExemple, null, 2));

    } catch (error) {
        console.error('❌ Erreur lors de la récupération du profil:', error);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    try {
        // Test 3: Recherche par email
        console.log('📧 Test 3: Recherche par email');
        console.log('='.repeat(50));
        
        const parametresEmail = {
            email: "jean.dupont@google.com",
            count: 3,
            timeout: 300
        };

        console.log('Paramètres email:', JSON.stringify(parametresEmail, null, 2));
        console.log('\n🚀 Recherche par email...');

        // REMPLACEZ CETTE LIGNE PAR L'APPEL RÉEL DANS CURSOR :
        // const resultatsEmail = await mcp_hdw_get_linkedin_email_user(parametresEmail);
        
        console.log('⚠️  Pour utiliser dans Cursor, remplacez par:');
        console.log('   const resultatsEmail = await mcp_hdw_get_linkedin_email_user(parametresEmail);');

    } catch (error) {
        console.error('❌ Erreur lors de la recherche par email:', error);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    try {
        // Test 4: Recherche avancée Sales Navigator
        console.log('🎯 Test 4: Recherche Sales Navigator');
        console.log('='.repeat(50));
        
        const parametresSalesNav = {
            current_companies: ["Google", "Microsoft", "Apple"],
            location: ["Paris, France", "Lyon, France"],
            functions: ["Engineering", "Information Technology"],
            levels: ["Senior", "Director"],
            company_sizes: ["1,001-5,000", "5,001-10,000"],
            count: 10,
            timeout: 300
        };

        console.log('Paramètres Sales Navigator:', JSON.stringify(parametresSalesNav, null, 2));
        console.log('\n🚀 Recherche avancée...');

        // REMPLACEZ CETTE LIGNE PAR L'APPEL RÉEL DANS CURSOR :
        // const resultatsAvances = await mcp_hdw_linkedin_sn_search_users(parametresSalesNav);
        
        console.log('⚠️  Pour utiliser dans Cursor, remplacez par:');
        console.log('   const resultatsAvances = await mcp_hdw_linkedin_sn_search_users(parametresSalesNav);');

    } catch (error) {
        console.error('❌ Erreur lors de la recherche Sales Navigator:', error);
    }
}

/**
 * Fonction pratique pour une recherche LinkedIn simple
 * À utiliser directement dans Cursor
 */
async function rechercheSimple(prenom, nom, entreprise = null) {
    const params = {
        first_name: prenom,
        last_name: nom,
        count: 5
    };
    
    if (entreprise) {
        params.current_company = entreprise;
    }

    console.log(`🔍 Recherche: ${prenom} ${nom}${entreprise ? ` chez ${entreprise}` : ''}`);
    
    // UTILISEZ CETTE LIGNE DANS CURSOR :
    // return await mcp_hdw_search_linkedin_users(params);
    
    console.log('⚠️  Remplacez par: await mcp_hdw_search_linkedin_users(params)');
    console.log('Paramètres:', JSON.stringify(params, null, 2));
}

/**
 * Guide d'utilisation rapide pour Cursor
 */
function guideUtilisationCursor() {
    console.log(`
🚀 GUIDE D'UTILISATION RAPIDE DANS CURSOR
==========================================

1. 📋 COPIER-COLLER DIRECT :

   // Recherche basique
   const resultats = await mcp_hdw_search_linkedin_users({
       first_name: "Jean",
       last_name: "Dupont",
       current_company: "Google",
       count: 5
   });

   // Afficher les résultats
   resultats.forEach(profil => {
       console.log(\`\${profil.first_name} \${profil.last_name} - \${profil.headline}\`);
   });

2. 🔍 RECHERCHE AVEC CRITÈRES :

   const resultats = await mcp_hdw_search_linkedin_users({
       first_name: "Marie",
       last_name: "Martin", 
       location: "Paris, France",
       title: "Developer",
       count: 10
   });

3. 👤 PROFIL DÉTAILLÉ :

   const profil = await mcp_hdw_get_linkedin_profile({
       user: "marie-martin-dev",
       with_experience: true,
       with_skills: true
   });

4. 🎯 RECHERCHE AVANCÉE :

   const resultats = await mcp_hdw_linkedin_sn_search_users({
       current_companies: ["Google", "Microsoft"],
       location: ["Paris, France"],
       functions: ["Engineering"],
       count: 20
   });

5. 📧 RECHERCHE PAR EMAIL :

   const resultats = await mcp_hdw_get_linkedin_email_user({
       email: "contact@exemple.com",
       count: 3
   });

✅ CONSEILS :
   • Testez avec des paramètres simples d'abord
   • Gérez les erreurs avec try/catch
   • Respectez les limites de taux de l'API
   • Utilisez timeout: 300 pour éviter les timeouts
`);
}

// Exécuter le guide et les tests
console.log('🔧 OUTILS MCP HORIZON DATA WAVE - TESTS ET GUIDE\n');
guideUtilisationCursor();

// Exporter pour utilisation
module.exports = {
    testerRechercheMCP,
    rechercheSimple,
    guideUtilisationCursor
};

// Lancer les tests si exécuté directement
if (require.main === module) {
    testerRechercheMCP().catch(console.error);
} 