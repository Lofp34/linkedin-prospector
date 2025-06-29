#!/bin/bash

# =====================================================
# SCRIPT DE CONFIGURATION HORIZON DATA WAVE
# =====================================================

echo "🔥 Configuration Horizon Data Wave (HDW) pour LinkedIn API"
echo "=========================================================="
echo ""

# Vérifier si .env.hdw existe déjà
if [ -f ".env.hdw" ]; then
    echo "⚠️  Le fichier .env.hdw existe déjà."
    read -p "Voulez-vous le remplacer ? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo "Configuration annulée."
        exit 0
    fi
fi

# Créer le fichier .env.hdw
cat > .env.hdw << 'EOF'
# =====================================================
# HORIZON DATA WAVE - Configuration des Credentials
# =====================================================
# 
# Pour utiliser les vraies APIs LinkedIn via Horizon Data Wave :
# 1. Allez sur https://app.horizondatawave.ai
# 2. Créez un compte gratuit (100 requêtes gratuites!)
# 3. Récupérez vos credentials dans le dashboard
# 4. Remplacez les valeurs ci-dessous
#
# BONUS: 100 requêtes GRATUITES par mois !
# Puis $0.025 par requête (très abordable)

# Token d'accès HDW (obligatoire)
HDW_ACCESS_TOKEN=hdw_VOTRE_TOKEN_ICI

# ID de compte HDW (obligatoire)  
HDW_ACCOUNT_ID=votre_account_id_ici

# =====================================================
# Configuration optionnelle
# =====================================================

# Timeout pour les requêtes HDW (en millisecondes)
HDW_TIMEOUT=30000

# Nombre maximum de résultats par recherche
HDW_MAX_RESULTS=50

# Activer le cache intelligent (recommandé)
HDW_ENABLE_CACHE=true

# TTL du cache en minutes
HDW_CACHE_TTL=30

# =====================================================
# Variables de développement
# =====================================================

# Mode debug pour voir les requêtes HDW
HDW_DEBUG=false

# Limiter les requêtes en développement
HDW_DEV_MODE=true
EOF

echo "✅ Fichier .env.hdw créé avec succès!"
echo ""

# Installer les dépendances HDW
echo "📦 Installation des dépendances Horizon Data Wave..."
npm install express-rate-limit @horizondatawave/mcp

echo ""
echo "🎯 PROCHAINES ÉTAPES :"
echo "====================="
echo ""
echo "1. 📝 INSCRIPTION HDW :"
echo "   → Allez sur https://app.horizondatawave.ai"
echo "   → Créez un compte gratuit"
echo "   → Récupérez vos credentials"
echo ""
echo "2. ⚙️  CONFIGURATION :"
echo "   → Éditez le fichier .env.hdw"
echo "   → Remplacez HDW_ACCESS_TOKEN par votre vrai token"
echo "   → Remplacez HDW_ACCOUNT_ID par votre vrai account ID"
echo ""
echo "3. 🚀 LANCEMENT :"
echo "   → Chargez les variables: source .env.hdw"
echo "   → Démarrez l'app HDW: npm run dev-hdw"
echo "   → Interface: http://localhost:3003"
echo ""
echo "4. 🧪 TEST :"
echo "   → Vérifiez le statut: npm run status-hdw"
echo "   → Testez une recherche réelle LinkedIn!"
echo ""
echo "💡 AIDE :"
echo "   → Guide complet: voir GUIDE-HORIZON-SETUP.md"
echo "   → Support: https://github.com/horizondatawave"
echo ""
echo "✨ Profitez des VRAIES données LinkedIn avec HDW! ✨"

# Ajouter .env.hdw au .gitignore si nécessaire
if ! grep -q ".env.hdw" .gitignore 2>/dev/null; then
    echo ".env.hdw" >> .gitignore
    echo "🔒 .env.hdw ajouté au .gitignore pour la sécurité"
fi 