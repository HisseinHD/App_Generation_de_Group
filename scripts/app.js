document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const participantsInput = document.getElementById('participants-input'); // Zone de texte pour entrer les noms des participants
    const teamSizeInput = document.getElementById('team-size'); // Champ pour définir la taille des équipes
    const generateBtn = document.getElementById('generate-btn'); // Bouton pour générer les équipes
    const resetBtn = document.getElementById('reset-btn'); // Bouton pour réinitialiser l'application
    const exportBtn = document.getElementById('export-btn'); // Bouton pour exporter les résultats en CSV
    const copyBtn = document.getElementById('copy-btn'); // Bouton pour copier les résultats
    const teamsContainer = document.getElementById('teams-container'); // Conteneur pour afficher les équipes générées

    // Écouteurs d'événements pour les actions utilisateur
    generateBtn.addEventListener('click', generateTeams); // Génération des équipes
    resetBtn.addEventListener('click', resetApp); // Réinitialisation de l'application
    exportBtn.addEventListener('click', exportToCSV); // Exportation des résultats en CSV
    copyBtn.addEventListener('click', copyResults); // Copie des résultats dans le presse-papiers

    // Fonction pour générer les équipes
    function generateTeams() {
        const participantsText = participantsInput.value.trim(); // Récupérer et nettoyer les noms des participants

        if (!participantsText) {
            alert('Veuillez entrer une liste de participants'); // Vérification de la saisie
            return;
        }

        // Conversion des noms en tableau
        let participants = participantsText.split(/[\n,]+/).map(p => p.trim()).filter(p => p);

        if (participants.length === 0) {
            alert('Aucun participant valide trouvé'); // Vérification des participants valides
            return;
        }

        const teamSize = parseInt(teamSizeInput.value); // Taille des équipes

        if (isNaN(teamSize) || teamSize < 2) {
            alert('La taille des équipes doit être au moins 2'); // Vérification de la taille des équipes
            return;
        }

        participants = shuffleArray(participants); // Mélange aléatoire des participants

        const teams = [];
        const totalTeams = Math.ceil(participants.length / teamSize); // Calcul du nombre total d'équipes

        for (let i = 0; i < totalTeams; i++) {
            teams.push([]); // Initialisation des équipes
        }

        participants.forEach((participant, index) => {
            const teamIndex = index % totalTeams; // Répartition des participants dans les équipes
            teams[teamIndex].push(participant);
        });

        displayTeams(teams); // Affichage des équipes générées
    }

    // Fonction pour afficher les équipes
    function displayTeams(teams) {
        teamsContainer.innerHTML = ''; // Réinitialisation du conteneur

        teams.forEach((team, index) => {
            const teamCard = document.createElement('div'); // Carte pour chaque équipe
            teamCard.className = 'team-card';

            const teamHeader = document.createElement('div'); // En-tête de l'équipe
            teamHeader.className = 'team-header';

            const teamTitle = document.createElement('h3'); // Titre de l'équipe
            teamTitle.className = 'team-title';
            teamTitle.textContent = `Équipe ${index + 1}`;

            const teamNumber = document.createElement('div'); // Nombre de membres dans l'équipe
            teamNumber.className = 'team-number';
            teamNumber.textContent = team.length;

            const teamMembers = document.createElement('ul'); // Liste des membres de l'équipe
            teamMembers.className = 'team-members';

            team.forEach(member => {
                const memberItem = document.createElement('li'); // Élément pour chaque membre
                memberItem.textContent = member;
                teamMembers.appendChild(memberItem);
            });

            teamHeader.appendChild(teamTitle);
            teamHeader.appendChild(teamNumber);
            teamCard.appendChild(teamHeader);
            teamCard.appendChild(teamMembers);
            teamsContainer.appendChild(teamCard); // Ajout de la carte au conteneur
        });
    }

    // Fonction pour réinitialiser l'application
    function resetApp() {
        participantsInput.value = ''; // Réinitialisation des participants
        teamSizeInput.value = '4'; // Réinitialisation de la taille des équipes
        teamsContainer.innerHTML = ''; // Réinitialisation des résultats
    }

    // Fonction pour exporter les résultats en CSV
    function exportToCSV() {
        const teamCards = document.querySelectorAll('.team-card'); // Récupération des cartes d'équipe

        if (teamCards.length === 0) {
            alert('Aucune équipe à exporter'); // Vérification des équipes
            return;
        }

        let csvContent = "Équipe,Membres\n"; // En-tête du fichier CSV

        teamCards.forEach((card, index) => {
            const teamName = `Équipe ${index + 1}`; // Nom de l'équipe
            const members = Array.from(card.querySelectorAll('li')).map(li => li.textContent).join(', '); // Membres de l'équipe
            csvContent += `"${teamName}","${members}"\n`; // Ajout au contenu CSV
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); // Création du fichier CSV
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); // Lien pour télécharger le fichier
        link.setAttribute('href', url);
        link.setAttribute('download', 'equipes.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Suppression du lien après téléchargement
    }

    // Fonction pour copier les résultats dans le presse-papiers
    function copyResults() {
        const teamCards = document.querySelectorAll('.team-card'); // Récupération des cartes d'équipe

        if (teamCards.length === 0) {
            alert('Aucune équipe à copier'); // Vérification des équipes
            return;
        }

        let textToCopy = ''; // Texte à copier

        teamCards.forEach((card, index) => {
            textToCopy += `Équipe ${index + 1}:\n`; // Nom de l'équipe
            const members = Array.from(card.querySelectorAll('li')).map(li => `- ${li.textContent}`).join('\n'); // Membres de l'équipe
            textToCopy += `${members}\n\n`; // Ajout des membres
        });

        navigator.clipboard.writeText(textToCopy.trim()).then(() => {
            alert('Résultats copiés dans le presse-papiers'); // Confirmation de la copie
        }).catch(err => {
            console.error('Erreur lors de la copie: ', err); // Gestion des erreurs
            alert('Erreur lors de la copie');
        });
    }

    // Fonction utilitaire pour mélanger un tableau
    function shuffleArray(array) {
        const newArray = [...array]; // Copie du tableau
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Index aléatoire
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Échange des éléments
        }
        return newArray; // Retourne le tableau mélangé
    }
});