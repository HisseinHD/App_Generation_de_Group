document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const participantsInput = document.getElementById('participants-input');
    const teamSizeInput = document.getElementById('team-size');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const exportBtn = document.getElementById('export-btn');
    const copyBtn = document.getElementById('copy-btn');
    const teamsContainer = document.getElementById('teams-container');

    // Générer les équipes
    generateBtn.addEventListener('click', generateTeams);
    resetBtn.addEventListener('click', resetApp);
    exportBtn.addEventListener('click', exportToCSV);
    copyBtn.addEventListener('click', copyResults);

    function generateTeams() {
        // Récupérer et nettoyer les participants
        const participantsText = participantsInput.value.trim();
        
        if (!participantsText) {
            alert('Veuillez entrer une liste de participants');
            return;
        }

        // Convertir en tableau
        let participants = participantsText.split(/[\n,]+/).map(p => p.trim()).filter(p => p);
        
        if (participants.length === 0) {
            alert('Aucun participant valide trouvé');
            return;
        }

        // Vérifier la taille des équipes
        const teamSize = parseInt(teamSizeInput.value);
        
        if (isNaN(teamSize) || teamSize < 2) {
            alert('La taille des équipes doit être au moins 2');
            return;
        }

        // Mélanger les participants aléatoirement
        participants = shuffleArray(participants);

        // Créer les équipes
        const teams = [];
        const totalTeams = Math.ceil(participants.length / teamSize);
        
        for (let i = 0; i < totalTeams; i++) {
            teams.push([]);
        }

        // Répartir les participants
        participants.forEach((participant, index) => {
            const teamIndex = index % totalTeams;
            teams[teamIndex].push(participant);
        });

        // Afficher les résultats
        displayTeams(teams);
    }

    function displayTeams(teams) {
        teamsContainer.innerHTML = '';
        
        teams.forEach((team, index) => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            
            const teamHeader = document.createElement('div');
            teamHeader.className = 'team-header';
            
            const teamTitle = document.createElement('h3');
            teamTitle.className = 'team-title';
            teamTitle.textContent = `Équipe ${index + 1}`;
            
            const teamNumber = document.createElement('div');
            teamNumber.className = 'team-number';
            teamNumber.textContent = team.length;
            
            const teamMembers = document.createElement('ul');
            teamMembers.className = 'team-members';
            
            team.forEach(member => {
                const memberItem = document.createElement('li');
                memberItem.textContent = member;
                teamMembers.appendChild(memberItem);
            });
            
            teamHeader.appendChild(teamTitle);
            teamHeader.appendChild(teamNumber);
            teamCard.appendChild(teamHeader);
            teamCard.appendChild(teamMembers);
            teamsContainer.appendChild(teamCard);
        });
    }

    function resetApp() {
        participantsInput.value = '';
        teamSizeInput.value = '4';
        teamsContainer.innerHTML = '';
    }

    function exportToCSV() {
        const teamCards = document.querySelectorAll('.team-card');
        
        if (teamCards.length === 0) {
            alert('Aucune équipe à exporter');
            return;
        }
        
        let csvContent = "Équipe,Membres\n";
        
        teamCards.forEach((card, index) => {
            const teamName = `Équipe ${index + 1}`;
            const members = Array.from(card.querySelectorAll('li')).map(li => li.textContent).join(', ');
            csvContent += `"${teamName}","${members}"\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'equipes.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function copyResults() {
        const teamCards = document.querySelectorAll('.team-card');
        
        if (teamCards.length === 0) {
            alert('Aucune équipe à copier');
            return;
        }
        
        let textToCopy = '';
        
        teamCards.forEach((card, index) => {
            textToCopy += `Équipe ${index + 1}:\n`;
            const members = Array.from(card.querySelectorAll('li')).map(li => `- ${li.textContent}`).join('\n');
            textToCopy += `${members}\n\n`;
        });
        
        navigator.clipboard.writeText(textToCopy.trim()).then(() => {
            alert('Résultats copiés dans le presse-papiers');
        }).catch(err => {
            console.error('Erreur lors de la copie: ', err);
            alert('Erreur lors de la copie');
        });
    }

    // Fonction utilitaire pour mélanger un tableau
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
});