#!/usr/bin/env node

/**
 * CLIENT MCP LINKEDIN HDW (HORIZON DATA WAVE) + SERVEUR EXPRESS
 * ============================================================
 * Client MCP connecté aux VRAIS outils Horizon Data Wave
 * Architecture MCP standard avec vraies APIs LinkedIn
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Démarrage du client LinkedIn MCP HDW (HORIZON DATA WAVE)...');

// Configuration HDW
const HDW_CONFIG = {
  port: 3003,
  mcpCommand: 'npx',
  mcpArgs: ['-y', '@horizondatawave/mcp'],
  timeout: 30000,
  maxRetries: 3,
  rateLimitWindow: 60 * 1000, // 1 minute
  rateLimitMax: 15 // 15 requêtes par minute
};

// État du client MCP HDW
let mcpClient = null;
let mcpTransport = null;
let mcpConnected = false;
let availableTools = [];
let requestCount = 0;
const MAX_FREE_REQUESTS = 100;

// Cache intelligent pour économiser les requêtes
const profileCache = new Map();
const searchCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Fonction de tracking des requêtes
function trackRequest() {
  requestCount++;
  console.log(`💰 Requêtes HDW utilisées: ${requestCount}/${MAX_FREE_REQUESTS}`);
  
  if (requestCount >= MAX_FREE_REQUESTS) {
    console.warn('⚠️ Limite gratuite HDW atteinte. Prochaines requêtes: $0.025 chacune');
  }
  
  return {
    used: requestCount,
    remaining: Math.max(0, MAX_FREE_REQUESTS - requestCount),
    cost: requestCount > MAX_FREE_REQUESTS ? (requestCount - MAX_FREE_REQUESTS) * 0.025 : 0
  };
}

// Fonction de cache intelligent
function getCacheKey(toolName, args) {
  return `${toolName}:${JSON.stringify(args)}`;
}

function setCache(key, data) {
  searchCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

function getCache(key) {
  const cached = searchCache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    console.log('💰 Cache hit - Requête économisée!');
    return cached.data;
  }
  if (cached) {
    searchCache.delete(key); // Expirer le cache
  }
  return null;
}

// Fonction de connexion au serveur MCP HDW
async function connectToMCPServer() {
  try {
    console.log('🔌 Connexion au serveur MCP Horizon Data Wave...');
    
    // Variables d'environnement HDW requises
    const hdwToken = process.env.HDW_ACCESS_TOKEN;
    const hdwAccountId = process.env.HDW_ACCOUNT_ID;
    
    if (!hdwToken || !hdwAccountId) {
      throw new Error('❌ Variables d\'environnement HDW_ACCESS_TOKEN et HDW_ACCOUNT_ID requises');
    }
    
    console.log(`✅ Token HDW configuré: ${hdwToken.substring(0, 8)}...`);
    console.log(`✅ Account ID: ${hdwAccountId}`);
    
    // Transport avec les credentials HDW
    mcpTransport = new StdioClientTransport({
      command: HDW_CONFIG.mcpCommand,
      args: HDW_CONFIG.mcpArgs,
      env: {
        ...process.env,
        HDW_ACCESS_TOKEN: hdwToken,
        HDW_ACCOUNT_ID: hdwAccountId
      }
    });
    
    mcpClient = new Client({
      name: 'linkedin-hdw-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });
    
    await mcpClient.connect(mcpTransport);
    
    // Récupérer les outils disponibles
    const tools = await mcpClient.listTools();
    availableTools = tools.tools || [];
    
    mcpConnected = true;
    
    console.log('✅ Connexion MCP HDW réussie!');
    console.log(`🛠️ ${availableTools.length} outils HDW disponibles:`);
    availableTools.forEach(tool => {
      console.log(`   - ${tool.name}: ${tool.description || 'Outil Horizon Data Wave'}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion MCP HDW:', error.message);
    mcpConnected = false;
    return false;
  }
}

// Fonction utilitaire pour appeler les outils HDW avec cache
async function callHDWTool(toolName, args, useCache = true) {
  if (!mcpConnected) {
    throw new Error('MCP HDW non connecté');
  }
  
  const cacheKey = getCacheKey(toolName, args);
  
  // Vérifier le cache
  if (useCache) {
    const cached = getCache(cacheKey);
    if (cached) {
      return cached;
    }
  }
  
  console.log(`🔍 Appel HDW: ${toolName}`, args);
  
  try {
    const result = await mcpClient.callTool({
      name: toolName,
      arguments: args
    });
    
    const usage = trackRequest();
    
    // Parser la réponse HDW (format flexible)
    let response = null;
    let raw_data = null;
    
    console.log('📋 Réponse HDW brute:', JSON.stringify(result, null, 2));
    
    if (result.content && result.content[0]) {
      const content = result.content[0];
      raw_data = content.text || content;
      
      if (content.type === 'text') {
        try {
          // Tentative de parsing JSON
          const parsed = JSON.parse(content.text);
          response = parsed;
          
          // Si HDW retourne un wrapper, extraire les données
          if (parsed.users) {
            response.users = parsed.users;
          } else if (parsed.results) {
            response.users = parsed.results;
          } else if (parsed.data) {
            response.users = parsed.data;
          } else if (Array.isArray(parsed)) {
            response.users = parsed;
          }
          
        } catch (parseError) {
          console.log('⚠️ Parsing JSON échoué, utilisation du texte brut');
          // Si le parsing JSON échoue, traiter comme texte
          response = { 
            message: content.text, 
            raw_text: content.text,
            users: [],
            success: false
          };
          
          // Tentative d'extraction manuelle pour les résultats textuels
          try {
            const userMatches = content.text.match(/\*\*(.*?)\*\*/g);
            if (userMatches && userMatches.length > 0) {
              response.users = userMatches.map((match, index) => ({
                name: match.replace(/\*\*/g, ''),
                id: `hdw_user_${index}`,
                source: 'horizon-data-wave-text'
              }));
              response.success = true;
            }
          } catch (extractError) {
            console.log('⚠️ Extraction manuelle échouée');
          }
        }
      }
    } else {
      console.log('⚠️ Pas de contenu dans la réponse HDW');
      response = { 
        users: [], 
        message: 'Pas de données retournées par HDW',
        success: false
      };
    }
    
    // S'assurer que response.users existe toujours
    if (!response.users) {
      response.users = [];
    }
    
    console.log('✅ Réponse parsée:', { 
      users_count: response.users.length, 
      has_data: !!response.users.length 
    });
    
    // Mettre en cache si succès
    if (useCache && response) {
      setCache(cacheKey, { response, usage, raw_data });
    }
    
    return { response, usage, raw_result: result, raw_data };
    
  } catch (error) {
    console.error(`❌ Erreur HDW ${toolName}:`, error.message);
    throw error;
  }
}

// Création du serveur Express
const app = express();

// Rate limiting pour protéger les APIs HDW
const hdwRateLimit = rateLimit({
  windowMs: HDW_CONFIG.rateLimitWindow,
  max: HDW_CONFIG.rateLimitMax,
  message: {
    error: 'Trop de requêtes HDW',
    retryAfter: Math.ceil(HDW_CONFIG.rateLimitWindow / 1000)
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Rate limiting sur les routes HDW
app.use('/api/hdw-', hdwRateLimit);

// Route : Status HDW
app.get('/api/status', async (req, res) => {
  try {
    const hdwToken = process.env.HDW_ACCESS_TOKEN;
    const hdwAccountId = process.env.HDW_ACCOUNT_ID;
    
    res.json({
      success: true,
      mcp_connected: mcpConnected,
      hdw_configured: !!(hdwToken && hdwAccountId),
      hdw_token_preview: hdwToken ? `${hdwToken.substring(0, 8)}...` : null,
      hdw_account_id: hdwAccountId,
      tools_count: availableTools.length,
      tools: availableTools.map(t => ({
        name: t.name,
        description: t.description
      })),
      usage: {
        requests_used: requestCount,
        requests_remaining: Math.max(0, MAX_FREE_REQUESTS - requestCount),
        estimated_cost: requestCount > MAX_FREE_REQUESTS ? (requestCount - MAX_FREE_REQUESTS) * 0.025 : 0
      },
      cache_size: searchCache.size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route : Recherche LinkedIn HDW (VRAIE API)
app.post('/api/hdw-search', async (req, res) => {
  try {
    const { keywords, firstName, lastName, company, location, title, count = 10 } = req.body;
    
    console.log('🔍 Recherche HDW LinkedIn:', { keywords, firstName, lastName, company, location });
    
    const result = await callHDWTool('search_linkedin_users', {
      keywords,
      first_name: firstName,
      last_name: lastName,
      current_company: company,
      company_keywords: company,
      location,
      title,
      count: Math.min(count, 50) // Limiter pour éviter les coûts
    });
    
    res.json({
      success: true,
      source: 'horizon-data-wave',
      data: result.response?.users || [],
      total: result.response?.total || 0,
      usage: result.usage,
      message: `Recherche HDW réussie - ${result.response?.total || 0} profils trouvés`,
      raw_message: result.response?.message
    });
    
  } catch (error) {
    console.error('❌ Erreur recherche HDW:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'horizon-data-wave'
    });
  }
});

// Route : Profil LinkedIn HDW (VRAIE API)
app.post('/api/hdw-profile', async (req, res) => {
  try {
    const { user } = req.body;
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Paramètre user requis (URL, URN, ou alias LinkedIn)'
      });
    }
    
    console.log('👤 Récupération profil HDW:', user);
    
    const result = await callHDWTool('get_linkedin_profile', {
      user,
      with_experience: true,
      with_education: true,
      with_skills: true
    });
    
    res.json({
      success: true,
      source: 'horizon-data-wave',
      profile: result.response?.profile || result.response,
      usage: result.usage,
      message: result.response?.message || 'Profil récupéré avec succès',
      raw_message: result.response
    });
    
  } catch (error) {
    console.error('❌ Erreur profil HDW:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'horizon-data-wave'
    });
  }
});

// Route : Recherche par email HDW (NOUVEAU!)
app.post('/api/hdw-email', async (req, res) => {
  try {
    const { email, count = 5 } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Paramètre email requis'
      });
    }
    
    console.log('📧 Recherche par email HDW:', email);
    
    const result = await callHDWTool('get_linkedin_email_user', {
      email,
      count: Math.min(count, 10)
    });
    
    res.json({
      success: true,
      source: 'horizon-data-wave',
      data: result.response?.users || [],
      total: result.response?.total || 0,
      usage: result.usage,
      message: `Recherche email HDW - ${result.response?.total || 0} profils trouvés`,
      raw_message: result.response
    });
    
  } catch (error) {
    console.error('❌ Erreur recherche email HDW:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'horizon-data-wave'
    });
  }
});

// Route : Google Company Search HDW
app.post('/api/hdw-company-search', async (req, res) => {
  try {
    const { keywords, with_urn = false } = req.body;
    
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        success: false,
        error: 'Paramètre keywords requis (array)'
      });
    }
    
    console.log('🏢 Recherche entreprise HDW:', keywords);
    
    const result = await callHDWTool('get_linkedin_google_company', {
      keywords,
      with_urn,
      count_per_keyword: 3
    });
    
    res.json({
      success: true,
      source: 'horizon-data-wave',
      companies: result.response?.companies || [],
      usage: result.usage,
      message: 'Recherche entreprise HDW réussie',
      raw_message: result.response
    });
    
  } catch (error) {
    console.error('❌ Erreur recherche entreprise HDW:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'horizon-data-wave'
    });
  }
});

// Route : Détails entreprise HDW
app.post('/api/hdw-company-details', async (req, res) => {
  try {
    const { company } = req.body;
    
    if (!company) {
      return res.status(400).json({
        success: false,
        error: 'Paramètre company requis (URN, URL, ou alias)'
      });
    }
    
    console.log('🏢 Détails entreprise HDW:', company);
    
    const result = await callHDWTool('get_linkedin_company', {
      company
    });
    
    res.json({
      success: true,
      source: 'horizon-data-wave',
      company: result.response?.company || result.response,
      usage: result.usage,
      message: 'Détails entreprise HDW récupérés',
      raw_message: result.response
    });
    
  } catch (error) {
    console.error('❌ Erreur détails entreprise HDW:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'horizon-data-wave'
    });
  }
});

// Route : Cache management
app.get('/api/hdw-cache/stats', (req, res) => {
  res.json({
    success: true,
    cache_size: searchCache.size,
    cache_entries: Array.from(searchCache.keys()).map(key => ({
      key,
      age_minutes: Math.round((Date.now() - searchCache.get(key).timestamp) / (60 * 1000))
    }))
  });
});

app.delete('/api/hdw-cache/clear', (req, res) => {
  const size = searchCache.size;
  searchCache.clear();
  res.json({
    success: true,
    message: `Cache vidé - ${size} entrées supprimées`
  });
});

// Route : Google Search HDW
app.post('/api/hdw-google-search', async (req, res) => {
  try {
    const { query, count = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Paramètre query requis'
      });
    }
    
    console.log('🔍 Google Search HDW:', query);
    
    const result = await callHDWTool('google_search', {
      query,
      count: Math.min(count, 20)
    });
    
    res.json({
      success: true,
      source: 'horizon-data-wave-google',
      results: result.response?.results || [],
      total: result.response?.total || 0,
      usage: result.usage,
      message: 'Recherche Google HDW réussie',
      raw_message: result.response
    });
    
  } catch (error) {
    console.error('❌ Erreur Google Search HDW:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'horizon-data-wave-google'
    });
  }
});

// =====================================================
// ROUTES DE COMPATIBILITÉ AVEC L'INTERFACE WEB EXISTANTE
// =====================================================

// Route de compatibilité : Recherche LinkedIn (ancienne interface)
app.post('/api/search-linkedin', async (req, res) => {
  try {
    const { firstName, lastName, company, location, title, keywords, count = 10 } = req.body;
    
    console.log('🔍 Recherche compatibilité LinkedIn:', { firstName, lastName, company, location });
    
    const result = await callHDWTool('search_linkedin_users', {
      keywords,
      first_name: firstName,
      last_name: lastName,
      current_company: company,
      company_keywords: company,
      location,
      title,
      count: Math.min(count, 50)
    });
    
    // Transformer le format pour l'ancienne interface
    const profiles = result.response?.users || [];
    
    res.json({
      success: true,
      source: 'horizon-data-wave',
      data: profiles,
      total: profiles.length,
      usage: result.usage,
      message: `Recherche HDW réussie - ${profiles.length} profils trouvés`,
      raw_message: result.response?.message
    });
    
  } catch (error) {
    console.error('❌ Erreur recherche compatibilité:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'horizon-data-wave'
    });
  }
});

// Route de compatibilité : Profil LinkedIn détaillé
app.post('/api/profile-details', async (req, res) => {
  try {
    const { user } = req.body;
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Paramètre user requis'
      });
    }
    
    console.log('👤 Profil compatibilité HDW:', user);
    
    const result = await callHDWTool('get_linkedin_profile', {
      user,
      with_experience: true,
      with_education: true,
      with_skills: true
    });
    
    res.json({
      success: true,
      source: 'horizon-data-wave',
      profile: result.response?.profile || result.response,
      usage: result.usage,
      message: result.response?.message || 'Profil récupéré avec succès',
      raw_message: result.response
    });
    
  } catch (error) {
    console.error('❌ Erreur profil compatibilité:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'horizon-data-wave'
    });
  }
});

// Route de compatibilité : Recherche par email
app.post('/api/search-email', async (req, res) => {
  try {
    const { email, count = 5 } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Paramètre email requis'
      });
    }
    
    console.log('📧 Email compatibilité HDW:', email);
    
    const result = await callHDWTool('get_linkedin_email_user', {
      email,
      count: Math.min(count, 10)
    });
    
    const profiles = result.response?.users || [];
    
    res.json({
      success: true,
      source: 'horizon-data-wave',
      data: profiles,
      total: profiles.length,
      usage: result.usage,
      message: `Recherche email HDW - ${profiles.length} profils trouvés`,
      raw_message: result.response
    });
    
  } catch (error) {
    console.error('❌ Erreur email compatibilité:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'horizon-data-wave'
    });
  }
});

// Route de compatibilité : Recherche avancée
app.post('/api/search-advanced', async (req, res) => {
  try {
    const { 
      current_companies,
      locations,
      functions,
      levels,
      keywords,
      count = 10 
    } = req.body;
    
    console.log('🎯 Recherche avancée compatibilité HDW:', { current_companies, locations, keywords });
    
    const result = await callHDWTool('linkedin_sn_search_users', {
      current_companies,
      location: locations,
      functions,
      levels,  
      keywords,
      count: Math.min(count, 50)
    });
    
    const profiles = result.response?.users || [];
    
    res.json({
      success: true,
      source: 'horizon-data-wave-sn',
      data: profiles,
      total: profiles.length,
      usage: result.usage,
      message: `Recherche avancée HDW - ${profiles.length} profils trouvés`,
      raw_message: result.response
    });
    
  } catch (error) {
    console.error('❌ Erreur recherche avancée compatibilité:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'horizon-data-wave-sn'
    });
  }
});

// Page d'accueil
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index-mcp.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    success: false,
    error: 'Erreur serveur interne',
    details: err.message
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    // Connexion au MCP HDW
    const connected = await connectToMCPServer();
    if (!connected) {
      console.warn('⚠️ MCP HDW non connecté - fonctionnalités limitées');
    }
    
    // Démarrage du serveur Express
    app.listen(HDW_CONFIG.port, () => {
      console.log(`\n🚀 ===== SERVEUR HDW LINKEDIN DÉMARRÉ =====`);
      console.log(`📡 Port: ${HDW_CONFIG.port}`);
      console.log(`🔗 Interface: http://localhost:${HDW_CONFIG.port}`);
      console.log(`💰 Requêtes gratuites restantes: ${MAX_FREE_REQUESTS - requestCount}`);
      console.log(`🛠️ Outils HDW disponibles: ${availableTools.length}`);
      
      if (connected) {
        console.log(`✅ MCP HDW connecté - VRAIES APIs LinkedIn actives!`);
      } else {
        console.log(`❌ MCP HDW déconnecté - vérifiez vos credentials`);
      }
      console.log(`=============================================\n`);
    });
    
  } catch (error) {
    console.error('❌ Erreur démarrage serveur:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur HDW...');
  
  if (mcpClient) {
    await mcpClient.disconnect();
  }
  
  console.log('👋 Serveur HDW arrêté proprement');
  process.exit(0);
});

// Démarrage
startServer(); 