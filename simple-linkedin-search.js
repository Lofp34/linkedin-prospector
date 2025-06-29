// 🔍 RECHERCHE LINKEDIN SIMPLE - COPIER-COLLER DANS CURSOR
// ========================================================
// Exemple minimal d'utilisation des outils MCP Horizon Data Wave

/**
 * Recherche LinkedIn simple - fonction prête à utiliser
 * Copiez cette fonction dans votre environnement Cursor
 */
async function rechercherLinkedIn(prenom, nom, entreprise = null, ville = null) {
    try {
        // Préparer les paramètres
        const params = {
            first_name: prenom,
            last_name: nom,
            count: 10,
            timeout: 300
        };

        // Ajouter critères optionnels
        if (entreprise) params.current_company = entreprise;
        if (ville) params.location = ville;

        console.log(`🔍 Recherche: ${prenom} ${nom}${entreprise ? ` chez ${entreprise}` : ''}${ville ? ` à ${ville}` : ''}`);

        // APPEL MCP RÉEL - Décommentez cette ligne dans Cursor :
        // const resultats = await mcp_hdw_search_linkedin_users(params);

        // Version de démonstration
        console.log('⚠️  Dans Cursor, remplacez par: const resultats = await mcp_hdw_search_linkedin_users(params);');
        console.log('Paramètres envoyés:', JSON.stringify(params, null, 2));

        // Affichage des résultats (exemple)
        const exempleResultats = [
            {
                first_name: prenom,
                last_name: nom,
                headline: "Senior Developer chez " + (entreprise || "Tech Company"),
                location: ville || "Paris, France",
                profile_url: "https://linkedin.com/in/exemple"
            }
        ];

        console.log('\n✅ Exemple de résultats:');
        exempleResultats.forEach((profil, i) => {
            console.log(`${i + 1}. ${profil.first_name} ${profil.last_name}`);
            console.log(`   💼 ${profil.headline}`);
            console.log(`   📍 ${profil.location}`);
            console.log(`   🔗 ${profil.profile_url}\n`);
        });

        return exempleResultats;

    } catch (error) {
        console.error('❌ Erreur:', error);
        throw error;
    }
}

/**
 * Obtenir détails d'un profil - fonction simple
 */
async function obtenirProfil(urlOuUrn) {
    try {
        console.log(`👤 Récupération du profil: ${urlOuUrn}`);

        // APPEL MCP RÉEL - Décommentez cette ligne dans Cursor :
        // const profil = await mcp_hdw_get_linkedin_profile({
        //     user: urlOuUrn,
        //     with_experience: true,
        //     with_education: true,
        //     with_skills: true
        // });

        console.log('⚠️  Dans Cursor, remplacez par: const profil = await mcp_hdw_get_linkedin_profile(...)');
        
        return { message: "Profil récupéré avec succès" };

    } catch (error) {
        console.error('❌ Erreur:', error);
        throw error;
    }
}

// 🚀 EXEMPLES D'UTILISATION DIRECTE
console.log('💡 EXEMPLES D\'APPELS LINKEDIN MCP\n');

// Exemple 1: Recherche basique
rechercherLinkedIn("Jean", "Dupont");

// Exemple 2: Recherche avec entreprise
setTimeout(() => rechercherLinkedIn("Marie", "Martin", "Google"), 2000);

// Exemple 3: Recherche avec ville
setTimeout(() => rechercherLinkedIn("Pierre", "Bernard", null, "Lyon, France"), 4000);

// Exemple 4: Recherche complète
setTimeout(() => rechercherLinkedIn("Sophie", "Durand", "Microsoft", "Paris, France"), 6000);

console.log(`
🔥 CODE À COPIER-COLLER DANS CURSOR
===================================

// 1. RECHERCHE SIMPLE
const profiles = await mcp_hdw_search_linkedin_users({
    first_name: "Jean",
    last_name: "Dupont",
    count: 5
});

// 2. RECHERCHE AVEC ENTREPRISE
const profiles = await mcp_hdw_search_linkedin_users({
    first_name: "Marie", 
    last_name: "Martin",
    current_company: "Google",
    count: 10
});

// 3. RECHERCHE AVEC LOCALISATION
const profiles = await mcp_hdw_search_linkedin_users({
    first_name: "Pierre",
    last_name: "Durand", 
    location: "Paris, France",
    count: 10
});

// 4. RECHERCHE AVANCÉE
const profiles = await mcp_hdw_search_linkedin_users({
    first_name: "Sophie",
    last_name: "Bernard",
    current_company: "Microsoft",
    location: "Lyon, France",
    title: "Developer",
    count: 15
});

// 5. PROFIL DÉTAILLÉ
const profile = await mcp_hdw_get_linkedin_profile({
    user: "marie-martin-google",
    with_experience: true,
    with_education: true,
    with_skills: true
});

// 6. RECHERCHE PAR EMAIL
const profiles = await mcp_hdw_get_linkedin_email_user({
    email: "jean.dupont@google.com",
    count: 3
});

// 7. SALES NAVIGATOR
const profiles = await mcp_hdw_linkedin_sn_search_users({
    current_companies: ["Google", "Microsoft"],
    location: ["Paris, France"],
    functions: ["Engineering"],
    levels: ["Senior"],
    count: 20
});

⭐ PARAMÈTRES UTILES:
• first_name, last_name - Nom et prénom
• current_company - Entreprise actuelle  
• location - Ville/région
• title - Poste recherché
• keywords - Mots-clés libres
• count - Nombre max de résultats
• timeout - Délai max (300s recommandé)
`);

// Export pour utilisation
module.exports = {
    rechercherLinkedIn,
    obtenirProfil
}; 