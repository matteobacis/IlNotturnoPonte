async function loadMatches() {
    console.log("Sto caricando le partite...");

    const matchResultsTable = document.getElementById("matchResults");
    if (!matchResultsTable) {
        console.error("Tabella risultati non trovata!");
        return;
    }

    matchResultsTable.innerHTML = "";

    try {
        const q = query(matchesRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        console.log("Dati ricevuti da Firebase:", querySnapshot.docs.length);

        querySnapshot.forEach(doc => {
            const match = doc.data();
            console.log("Partita:", match);

            const row = `<tr><td>${match.team1}</td><td>${match.score1} - ${match.score2}</td><td>${match.team2}</td></tr>`;
            matchResultsTable.innerHTML += row;
        });

        calculateStandings(querySnapshot);
    } catch (error) {
        console.error("Errore nel caricamento delle partite:", error);
    }
}
