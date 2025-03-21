// Importa Firebase dal CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Configura Firebase (usando i tuoi dati reali)
const firebaseConfig = {
    apiKey: "AIzaSyAFdch6xO7a2OSnfYMjDFbwZM_tAWQO-uQ",
    authDomain: "notturnoponte.firebaseapp.com",
    projectId: "notturnoponte",
    storageBucket: "notturnoponte.appspot.com",  // 🔹 CORRETTO
    messagingSenderId: "340129095012",
    appId: "1:340129095012:web:98b87c491cccaf2724ae71"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const matchesRef = collection(db, "matches");

// Funzione per salvare un nuovo risultato
async function saveMatch(team1, score1, team2, score2) {
    try {
        await addDoc(matchesRef, {
            team1,
            score1,
            team2,
            score2,
            timestamp: new Date()
        });
        alert("Risultato salvato con successo!");
        loadMatches();  // Ricarica i dati
    } catch (error) {
        console.error("Errore nel salvataggio:", error);
    }
}

// Funzione per caricare e mostrare i risultati
async function loadMatches() {
    const matchResultsTable = document.getElementById("matchResults")?.querySelector("tbody");
    if (!matchResultsTable) return;

    matchResultsTable.innerHTML = "";  // Pulisce la tabella

    const q = query(matchesRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
        const match = doc.data();
        const row = `<tr><td>${match.team1}</td><td>${match.score1} - ${match.score2}</td><td>${match.team2}</td></tr>`;
        matchResultsTable.innerHTML += row;
    });
}

// Se siamo nella pagina Admin, gestiamo l'inserimento dei risultati
if (document.getElementById("saveResult")) {
    document.getElementById("saveResult").addEventListener("click", () => {
        const team1 = document.getElementById("team1").value;
        const score1 = parseInt(document.getElementById("score1").value);
        const team2 = document.getElementById("team2").value;
        const score2 = parseInt(document.getElementById("score2").value);

        if (team1 && team2 && !isNaN(score1) && !isNaN(score2)) {
            saveMatch(team1, score1, team2, score2);
        } else {
            alert("Compila tutti i campi correttamente!");
        }
    });
}

// Carica i risultati all'avvio
loadMatches();
