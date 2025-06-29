#!/usr/bin/env node

/**
 * Serveur MCP LinkedIn avec Horizon Data Wave
 * Architecture MCP standard selon spécifications officielles
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  ListToolsRequestSchema,
  CallToolRequestSchema,
  InitializeRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

// Configuration Horizon Data Wave
const HDW_CONFIG = {
  baseUrl: 'https://api.horizondatawave.com/v1',
  apiKey: process.env.HDW_API_KEY || '',
  maxRetries: 3,
  timeout: 30000
};

console.log('🚀 Démarrage serveur MCP LinkedIn...');

// Création du serveur MCP
const server = new Server(
  {
    name: 'linkedin-mcp-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

// Fonction utilitaire pour simuler l'API Horizon Data Wave (mode démo)
async function callHDWApi(endpoint, params = {}) {
  console.log(`📡 Simulation API HDW: ${endpoint}`, params);
  
  // Mode simulation directe pour la démonstration
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulation latence
  
  if (endpoint.includes('search_linkedin_users')) {
    const profiles = [
      {
        name: `${params.first_name || 'Jean'} ${params.last_name || 'Dupont'}`,
        title: 'Consultant en Stratégie Digitale',
        company: params.current_company || 'Cabinet de Conseil Innovation',
        location: params.location || 'Paris, France',
        urn: 'fsd_profile:ACoAAExample123',
        url: 'https://linkedin.com/in/jean-dupont-strategy'
      },
      {
        name: `${params.first_name || 'Jean'} ${params.last_name || 'Dupont'}`,
        title: 'Directeur Commercial',
        company: 'TechCorp Solutions',
        location: params.location || 'Lyon, France', 
        urn: 'fsd_profile:ACoAAExample456',
        url: 'https://linkedin.com/in/jean-dupont-commercial'
      },
      {
        name: `${params.first_name || 'Jean'} ${params.last_name || 'Dupont'}`,
        title: 'Chef de Projet',
        company: 'Digital Experts',
        location: params.location || 'Marseille, France',
        urn: 'fsd_profile:ACoAAExample789', 
        url: 'https://linkedin.com/in/jean-dupont-chef-projet'
      }
    ];
    
    return {
      users: profiles.slice(0, params.count || 10),
      total: profiles.length
    };
  }
  
  if (endpoint.includes('profile')) {
    return {
      name: `${params.user}`,
      headline: 'Senior Consultant en Transformation Digitale',
      location: 'Paris, France',
      summary: 'Expert en transformation digitale avec 10 ans d\'expérience dans l\'accompagnement d\'entreprises du CAC 40.',
      experience: [
        {
          title: 'Senior Consultant',
          company: 'Cabinet de Conseil Innovation',
          duration: '2020 - Présent'
        },
        {
          title: 'Chef de Projet Digital',
          company: 'TechCorp Solutions', 
          duration: '2018 - 2020'
        },
        {
          title: 'Consultant Junior',
          company: 'Digital Experts',
          duration: '2016 - 2018'
        }
      ],
      education: [
        {
          degree: 'Master en Management',
          school: 'ESSEC Business School',
          year: '2016'
        },
        {
          degree: 'Ingénieur Informatique',
          school: 'École Centrale',
          year: '2014'
        }
      ],
      skills: [
        'Transformation Digitale', 'Gestion de Projet', 'Stratégie d\'Entreprise',
        'Leadership', 'Innovation', 'Conseil', 'Management', 'Digital'
      ]
    };
  }
  
  if (endpoint.includes('email')) {
    return {
      users: [
        {
          name: 'Jean Dupont',
          title: 'Consultant Senior',
          company: 'Cabinet Innovation',
          url: 'https://linkedin.com/in/jean-dupont-email'
        }
      ],
      total: 1
    };
  }
  
  if (endpoint.includes('advanced')) {
    return {
      users: [
        {
          name: 'Jean Dupont',
          title: 'Directeur Innovation',
          company: 'TechCorp Advanced',
          location: 'Paris, France',
          industry: 'Technology',
          url: 'https://linkedin.com/in/jean-dupont-advanced'
        },
        {
          name: 'Marie Martin', 
          title: 'Responsable Marketing',
          company: 'Digital Solutions',
          location: 'Lyon, France',
          industry: 'Marketing',
          url: 'https://linkedin.com/in/marie-martin-marketing'
        }
      ],
      total: 2
    };
  }
  
  return { users: [], total: 0 };
}

// Handler pour lister les outils disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.log('📋 Liste des outils demandée');
  
  return {
    tools: [
      {
        name: 'search_linkedin_users',
        description: 'Recherche des utilisateurs LinkedIn par nom et critères',
        inputSchema: {
          type: 'object',
          properties: {
            first_name: {
              type: 'string',
              description: 'Prénom exact de la personne'
            },
            last_name: {
              type: 'string', 
              description: 'Nom de famille exact de la personne'
            },
            keywords: {
              type: 'string',
              description: 'Mots-clés pour la recherche dans le profil'
            },
            current_company: {
              type: 'string',
              description: 'Entreprise actuelle'
            },
            location: {
              type: 'string',
              description: 'Localisation géographique'
            },
            title: {
              type: 'string',
              description: 'Mots exacts dans le titre/poste'
            },
            count: {
              type: 'number',
              description: 'Nombre maximum de résultats (défaut: 10)',
              default: 10
            }
          },
          required: []
        }
      },
      {
        name: 'get_linkedin_profile',
        description: 'Récupère les détails complets d\'un profil LinkedIn',
        inputSchema: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              description: 'URN utilisateur, URL ou alias LinkedIn',
              examples: ['fsd_profile:ACoAAExample123', 'https://linkedin.com/in/username', 'username']
            },
            with_experience: {
              type: 'boolean',
              description: 'Inclure les expériences professionnelles',
              default: true
            },
            with_education: {
              type: 'boolean', 
              description: 'Inclure la formation académique',
              default: true
            },
            with_skills: {
              type: 'boolean',
              description: 'Inclure les compétences',
              default: true
            }
          },
          required: ['user']
        }
      },
      {
        name: 'search_linkedin_by_email',
        description: 'Trouve des profils LinkedIn associés à une adresse email',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Adresse email à rechercher',
              format: 'email'
            },
            count: {
              type: 'number',
              description: 'Nombre maximum de résultats',
              default: 5
            }
          },
          required: ['email']
        }
      },
      {
        name: 'advanced_linkedin_search',
        description: 'Recherche avancée LinkedIn avec filtres Sales Navigator',
        inputSchema: {
          type: 'object',
          properties: {
            keywords: {
              type: 'string',
              description: 'Mots-clés pour recherche dans le profil'
            },
            current_companies: {
              type: 'array',
              items: { type: 'string' },
              description: 'Entreprises actuelles (noms ou URNs)'
            },
            location: {
              type: 'array',
              items: { type: 'string' },
              description: 'Localisations géographiques'
            },
            current_titles: {
              type: 'array',
              items: { type: 'string' },
              description: 'Mots exacts dans les titres actuels'
            },
            industry: {
              type: 'array',
              items: { type: 'string' },
              description: 'Secteurs d\'activité'
            },
            count: {
              type: 'number',
              description: 'Nombre maximum de résultats',
              default: 10
            }
          },
          required: []
        }
      }
    ]
  };
});

// Handler pour exécuter les outils
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  console.log(`🔧 Exécution outil: ${name}`, JSON.stringify(args, null, 2));
  
  try {
    switch (name) {
      case 'search_linkedin_users': {
        const result = await callHDWApi('/linkedin/search/users', {
          first_name: args.first_name,
          last_name: args.last_name,
          keywords: args.keywords,
          current_company: args.current_company,
          location: args.location,
          title: args.title,
          count: args.count || 10
        });

        console.log('🔍 Résultat API HDW:', JSON.stringify(result, null, 2));

        const users = result.users || [];
        console.log(`📊 Nombre d'utilisateurs: ${users.length}`);
        
        let response = `🔍 **Recherche LinkedIn** - ${users.length} profil(s) trouvé(s)\n\n`;
        
        users.forEach((user, index) => {
          response += `**${index + 1}. ${user.name}**\n`;
          response += `📋 Poste: ${user.title || 'Non spécifié'}\n`;
          response += `🏢 Entreprise: ${user.company || 'Non spécifiée'}\n`;
          response += `📍 Localisation: ${user.location || 'Non spécifiée'}\n`;
          if (user.url) response += `🔗 Profil: ${user.url}\n`;
          if (user.urn) response += `🆔 URN: ${user.urn}\n`;
          response += '\n';
        });

        return {
          content: [{ type: 'text', text: response }]
        };
      }
      
      case 'get_linkedin_profile': {
        const result = await callHDWApi('/linkedin/profile', {
          user: args.user,
          with_experience: args.with_experience !== false,
          with_education: args.with_education !== false,
          with_skills: args.with_skills !== false
        });

        let response = `👤 **Profil LinkedIn Détaillé**\n\n`;
        response += `**${result.name || 'Nom non disponible'}**\n`;
        if (result.headline) response += `💼 ${result.headline}\n`;
        if (result.location) response += `📍 ${result.location}\n`;
        if (result.summary) response += `\n📝 **Résumé:**\n${result.summary}\n`;
        
        if (result.experience && result.experience.length > 0) {
          response += `\n💼 **Expérience Professionnelle:**\n`;
          result.experience.slice(0, 3).forEach(exp => {
            response += `• ${exp.title} chez ${exp.company} (${exp.duration || 'Durée non spécifiée'})\n`;
          });
        }

        if (result.education && result.education.length > 0) {
          response += `\n🎓 **Formation:**\n`;
          result.education.slice(0, 2).forEach(edu => {
            response += `• ${edu.degree || 'Diplôme'} - ${edu.school} (${edu.year || 'Année non spécifiée'})\n`;
          });
        }

        if (result.skills && result.skills.length > 0) {
          response += `\n🛠️ **Compétences:**\n`;
          response += result.skills.slice(0, 10).join(', ') + '\n';
        }

        return {
          content: [{ type: 'text', text: response }]
        };
      }
      
      case 'search_linkedin_by_email': {
        const result = await callHDWApi('/linkedin/search/email', {
          email: args.email,
          count: args.count || 5
        });

        const users = result.users || [];
        let response = `📧 **Recherche par Email** - ${users.length} profil(s) associé(s)\n\n`;
        
        if (users.length === 0) {
          response += 'Aucun profil LinkedIn trouvé pour cette adresse email.\n';
        } else {
          users.forEach((user, index) => {
            response += `**${index + 1}. ${user.name}**\n`;
            response += `📋 ${user.title || 'Poste non spécifié'}\n`;
            response += `🏢 ${user.company || 'Entreprise non spécifiée'}\n`;
            if (user.url) response += `🔗 ${user.url}\n`;
            response += '\n';
          });
        }

        return {
          content: [{ type: 'text', text: response }]
        };
      }
      
      case 'advanced_linkedin_search': {
        const result = await callHDWApi('/linkedin/search/advanced', args);

        const users = result.users || [];
        let response = `🎯 **Recherche Avancée LinkedIn** - ${users.length} profil(s) trouvé(s)\n\n`;
        
        users.forEach((user, index) => {
          response += `**${index + 1}. ${user.name}**\n`;
          response += `📋 ${user.title || 'Poste non spécifié'}\n`;
          response += `🏢 ${user.company || 'Entreprise non spécifiée'}\n`;
          response += `📍 ${user.location || 'Localisation non spécifiée'}\n`;
          if (user.industry) response += `🏭 Secteur: ${user.industry}\n`;
          if (user.url) response += `🔗 ${user.url}\n`;
          response += '\n';
        });

        return {
          content: [{ type: 'text', text: response }]
        };
      }
      
      default:
        throw new Error(`Outil inconnu: ${name}`);
    }
  } catch (error) {
    console.error(`❌ Erreur outil ${name}:`, error.message);
    return {
      content: [{ 
        type: 'text', 
        text: `❌ Erreur lors de l'exécution de ${name}: ${error.message}` 
      }],
      isError: true
    };
  }
});

// Handler pour lister les ressources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'linkedin://status',
        name: 'Statut du serveur LinkedIn MCP',
        description: 'Informations sur l\'état et la configuration du serveur',
        mimeType: 'text/plain'
      }
    ]
  };
});

// Handler pour lire les ressources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  if (uri === 'linkedin://status') {
    const status = {
      server: 'LinkedIn MCP Server',
      version: '1.0.0',
      status: 'actif',
      api_configured: !!HDW_CONFIG.apiKey,
      tools_available: 4,
      timestamp: new Date().toISOString()
    };
    
    return {
      contents: [{
        uri,
        text: JSON.stringify(status, null, 2),
        mimeType: 'application/json'
      }]
    };
  }
  
  throw new Error(`Ressource non trouvée: ${uri}`);
});

// Démarrage du serveur
async function main() {
  try {
    console.log('🔧 Configuration du transport stdio...');
    const transport = new StdioServerTransport();
    
    console.log('🔌 Connexion du serveur MCP...');
    await server.connect(transport);
    
    console.log('✅ Serveur MCP LinkedIn démarré avec succès !');
    console.log('📡 Prêt à recevoir des requêtes...');
    
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur MCP LinkedIn...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur MCP LinkedIn...');
  process.exit(0);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { server }; 