// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAFdch6xO7a2OSnfYMjDFbwZM_tAWQO-uQ",
    authDomain: "notturnoponte.firebaseapp.com",
    projectId: "notturnoponte",
    storageBucket: "notturnoponte.appspot.com",
    messagingSenderId: "340129095012",
    appId: "1:340129095012:web:98b87c491cccaf2724ae71"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Recupera i risultati delle partite
async function loadMatches() {
    console.log("🔄 Caricamento risultati partite...");
    const matchResultsTable = document.getElementById("matchResults");

    try {
        const querySnapshot = await db.collection("matches").orderBy("timestamp", "desc").get();
        matchResultsTable.innerHTML = ""; // Svuota la tabella prima di riempirla

        let matches = [];
        querySnapshot.forEach(doc => {
            const match = doc.data();
            matches.push(match);

            const row = `<tr>
                            <td>${match.team1}</td>
                            <td>${match.score1} - ${match.score2}</td>
                            <td>${match.team2}</td>
                        </tr>`;
            matchResultsTable.innerHTML += row;
        });

        console.log("✅ Partite caricate:", matches);
        calculateStandings(matches);
    } catch (error) {
        console.error("❌ Errore nel caricamento delle partite:", error);
    }
}

// Calcola la classifica
function calculateStandings(matches) {
    console.log("📊 Calcolo classifica...");
    const standings = {};

    matches.forEach(match => {
        const { team1, team2, score1, score2 } = match;

        if (!standings[team1]) standings[team1] = { points: 0, goalsFor: 0, goalsAgainst: 0 };
        if (!standings[team2]) standings[team2] = { points: 0, goalsFor: 0, goalsAgainst: 0 };

        standings[team1].goalsFor += score1;
        standings[team1].goalsAgainst += score2;
        standings[team2].goalsFor += score2;
        standings[team2].goalsAgainst += score1;

        if (score1 > score2) {
            standings[team1].points += 3;
        } else if (score1 < score2) {
            standings[team2].points += 3;
        } else {
            standings[team1].points += 1;
            standings[team2].points += 1;
        }
    });

    updateStandingsTable(standings);
}

// Aggiorna la tabella della classifica
function updateStandingsTable(standings) {
    const standingsTable = document.getElementById("standings");
    standingsTable.innerHTML = "";

    const sortedTeams = Object.entries(standings).sort((a, b) => b[1].points - a[1].points);
    
    sortedTeams.forEach(([team, stats]) => {
        const row = `<tr>
                        <td>${team}</td>
                        <td>${stats.points}</td>
                        <td>${stats.goalsFor}</td>
                        <td>${stats.goalsAgainst}</td>
                    </tr>`;
        standingsTable.innerHTML += row;
    });

    console.log("✅ Classifica aggiornata:", sortedTeams);
}

// Carica i dati quando la pagina è pronta
window.onload = loadMatches;
