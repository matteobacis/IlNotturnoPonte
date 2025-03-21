import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const matchesRef = collection(db, "matches");

// 🔹 Funzione per caricare i risultati delle partite
async function loadMatches() {
    const matchResultsTable = document.getElementById("matchResults");
    if (!matchResultsTable) return;

    matchResultsTable.innerHTML = ""; // Pulisce la tabella

    const q = query(matchesRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
        const match = doc.data();
        const row = `<tr><td>${match.team1}</td><td>${match.score1} - ${match.score2}</td><td>${match.team2}</td></tr>`;
        matchResultsTable.innerHTML += row;
    });

    calculateStandings(querySnapshot);
}

// 🔹 Funzione per calcolare la classifica
function calculateStandings(querySnapshot) {
    let standings = {};

    querySnapshot.forEach(doc => {
        const match = doc.data();
        const { team1, score1, team2, score2 } = match;

        if (!standings[team1]) standings[team1] = { points: 0, gf: 0, gs: 0 };
        if (!standings[team2]) standings[team2] = { points: 0, gf: 0, gs: 0 };

        standings[team1].gf += score1;
        standings[team1].gs += score2;
        standings[team2].gf += score2;
        standings[team2].gs += score1;

        if (score1 > score2) {
            standings[team1].points += 3;
        } else if (score1 < score2) {
            standings[team2].points += 3;
        } else {
            standings[team1].points += 1;
            standings[team2].points += 1;
        }
    });

    // Converti oggetto in array e ordina per punti
    const sortedStandings = Object.entries(standings).map(([team, stats]) => ({
        team,
        points: stats.points,
        gf: stats.gf,
        gs: stats.gs
    })).sort((a, b) => b.points - a.points || (b.gf - b.gs) - (a.gf - a.gs));

    // Mostra la classifica
    const standingsTable = document.getElementById("standings");
    standingsTable.innerHTML = "";
    sortedStandings.forEach(team => {
        const row = `<tr><td>${team.team}</td><td>${team.points}</td><td>${team.gf}</td><td>${team.gs}</td></tr>`;
        standingsTable.innerHTML += row;
    });
}

// Carica i dati all'apertura della pagina
loadMatches();
