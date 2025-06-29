class LinkedInSearchApp {
    constructor() {
        this.form = document.getElementById('searchForm');
        this.resultsSection = document.getElementById('results');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.errorDiv = document.getElementById('error');
        this.searchBtn = this.form.querySelector('.search-btn');
        this.btnText = this.form.querySelector('.btn-text');
        this.loadingSpinner = this.form.querySelector('.loading-spinner');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });

        // Changement dynamique du placeholder selon le type de recherche
        const searchType = document.getElementById('searchType');
        const searchValue = document.getElementById('searchValue');
        
        searchType.addEventListener('change', () => {
            const placeholders = {
                'company': 'Ex: Google, Microsoft, Apple...',
                'location': 'Ex: Paris, Lyon, France...',
                'title': 'Ex: Développeur, Manager, Consultant...',
                'keywords': 'Ex: JavaScript, Marketing, Innovation...'
            };
            searchValue.placeholder = placeholders[searchType.value];
        });
    }

    showLoading(show) {
        if (show) {
            this.btnText.textContent = 'Recherche en cours...';
            this.loadingSpinner.style.display = 'block';
            this.searchBtn.disabled = true;
        } else {
            this.btnText.textContent = 'Rechercher';
            this.loadingSpinner.style.display = 'none';
            this.searchBtn.disabled = false;
        }
    }

    hideError() {
        this.errorDiv.style.display = 'none';
    }

    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.style.display = 'block';
        this.resultsSection.style.display = 'none';
    }

    async performSearch() {
        this.showLoading(true);
        this.hideError();

        const formData = new FormData(this.form);
        const searchParams = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            searchType: formData.get('searchType'),
            searchValue: formData.get('searchValue').trim(),
            resultCount: parseInt(formData.get('resultCount'))
        };

        try {
            // Préparer les paramètres de recherche pour l'API LinkedIn
            const searchOptions = this.buildSearchOptions(searchParams);
            
            // Simuler l'appel à l'API MCP (en réalité, cette logique devrait être côté serveur)
            const results = await this.callLinkedInSearch(searchOptions);
            
            this.displayResults(results);
            
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            this.showError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
        } finally {
            this.showLoading(false);
        }
    }

    buildSearchOptions(params) {
        const options = {
            count: params.resultCount,
            first_name: params.firstName,
            last_name: params.lastName
        };

        // Ajouter le paramètre spécifique selon le type de recherche
        switch (params.searchType) {
            case 'company':
                if (params.searchValue) {
                    options.current_company = params.searchValue;
                }
                break;
            case 'location':
                if (params.searchValue) {
                    options.location = params.searchValue;
                }
                break;
            case 'title':
                if (params.searchValue) {
                    options.title = params.searchValue;
                }
                break;
            case 'keywords':
                if (params.searchValue) {
                    options.keywords = params.searchValue;
                }
                break;
        }

        return options;
    }

    async callLinkedInSearch(options) {
        // Note: En production, cette fonction devrait appeler votre backend
        // qui utiliserait les outils MCP Horizon Data Wave
        // Pour la démonstration, on simule des résultats

        // Simuler un délai de recherche
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Données de démonstration
        const mockResults = [
            {
                firstName: options.first_name,
                lastName: options.last_name,
                headline: "Développeur Full Stack chez Tech Corp",
                location: "Paris, France",
                company: "Tech Corp",
                profileUrl: "#",
                summary: "Passionné par le développement web et les nouvelles technologies. 5 ans d'expérience en JavaScript, React, Node.js.",
                connections: "500+",
                industry: "Technologie de l'information"
            },
            {
                firstName: options.first_name,
                lastName: options.last_name + "2",
                headline: "Chef de projet chez Innovation Labs",
                location: "Lyon, France", 
                company: "Innovation Labs",
                profileUrl: "#",
                summary: "Expert en gestion de projet agile et transformation digitale. Leadership d'équipes techniques.",
                connections: "300+",
                industry: "Conseil en gestion"
            }
        ];

        // Simuler parfois aucun résultat
        if (Math.random() < 0.1) {
            return [];
        }

        return mockResults.slice(0, Math.min(options.count, mockResults.length));
    }

    displayResults(results) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = '<div class="no-results">Aucun profil trouvé pour ces critères de recherche.</div>';
        } else {
            this.resultsContainer.innerHTML = results.map(profile => this.createProfileCard(profile)).join('');
        }
        
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    createProfileCard(profile) {
        const initials = (profile.firstName.charAt(0) + profile.lastName.charAt(0)).toUpperCase();
        
        return `
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">${initials}</div>
                    <div class="profile-info">
                        <h4>${profile.firstName} ${profile.lastName}</h4>
                        <p><strong>${profile.headline}</strong></p>
                        <p>📍 ${profile.location}</p>
                    </div>
                </div>
                
                <div class="profile-details">
                    <p><strong>Entreprise:</strong> ${profile.company}</p>
                    <p><strong>Secteur:</strong> ${profile.industry}</p>
                    <p><strong>Connexions:</strong> ${profile.connections}</p>
                    ${profile.summary ? `<p><strong>Résumé:</strong> ${profile.summary}</p>` : ''}
                </div>
                
                <div class="profile-actions">
                    <button class="btn-primary" onclick="window.open('${profile.profileUrl}', '_blank')">
                        Voir le profil LinkedIn
                    </button>
                    <button class="btn-secondary" onclick="app.viewFullProfile('${profile.profileUrl}')">
                        Détails complets
                    </button>
                </div>
            </div>
        `;
    }

    async viewFullProfile(profileUrl) {
        // Cette fonction pourrait appeler l'outil mcp_hdw_get_linkedin_profile
        // pour obtenir plus de détails sur le profil
        alert('Fonctionnalité à implémenter: récupération des détails complets du profil');
    }
}

// Initialiser l'application
const app = new LinkedInSearchApp();

// Fonctions utilitaires
window.app = app; 