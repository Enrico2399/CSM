

// Usa la stessa versione (10.7.1) per tutti i moduli
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBiL7kyKVAmujIm3lJ_BZ646YVLVm1QQXY",
    authDomain: "csmtreviso-f59fe.firebaseapp.com",
    databaseURL: "https://csmtreviso-f59fe-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "csmtreviso-f59fe",
    storageBucket: "csmtreviso-f59fe.firebasestorage.app",
    messagingSenderId: "793401975118",
    appId: "1:793401975118:web:86f68532f81604a3fbe396"
};

// Inizializzazione corretta
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Esponi le funzioni al browser
window.voteInFirebase = function(featureId, userName) {
    const voteRef = ref(db, 'votes/' + featureId);
    
    onValue(voteRef, (snapshot) => {
        const currentVotes = snapshot.val() || 0;
        set(voteRef, currentVotes + 1);
    }, { onlyOnce: true });

    const newLogRef = push(ref(db, 'logs'));
    set(newLogRef, {
        user: userName || "Anonimo",
        feature: featureId,
        timestamp: new Date().toISOString()
    });
};

window.vote = function(id) {
    if(sessionStorage.getItem('voted_' + id)) return;
    const userName = localStorage.getItem('moodWheel_userName') || "Utente Demo";
    window.voteInFirebase(id, userName);
    sessionStorage.setItem('voted_' + id, 'true');
    const btnEl = document.getElementById('btn-' + id);
    if(btnEl) {
        btnEl.classList.add('voted');
        btnEl.innerHTML = "❤️ Votato";
    }
};

window.listenToVotes = function(callback) {
    onValue(ref(db, 'votes'), (snapshot) => {
        callback(snapshot.val());
    });
};

// Esegui l'ascolto se sei in roadmap
if (window.location.pathname.includes('roadmap.html')) {
    window.listenToVotes((votes) => {
        if (!votes) return;
        const ids = ['tracker', 'grounding', 'panic', 'resources', 'pantheon'];
        ids.forEach(id => {
            const countEl = document.getElementById('count-' + id);
            if(countEl) countEl.innerText = (votes[id] || 0) + " voti";
        });
    });
}


function updateNavName() {
    const savedName = localStorage.getItem('moodWheel_userName');
    const display = document.getElementById('nav-user-name');
    if(savedName && display) display.innerText = savedName;
}


// Inizializza all'avvio
document.addEventListener('DOMContentLoaded', updateNavName);

// --- GESTIONE PROFILO (ESPOSTA GLOBALMENTE) ---

window.openProfile = function() {
    const modal = document.getElementById('profile-modal');
    if(modal) {
        modal.style.display = 'flex';
        const savedName = localStorage.getItem('moodWheel_userName');
        if(savedName) document.getElementById('user-name-input').value = savedName;
    }
};

window.closeProfile = function() {
    const modal = document.getElementById('profile-modal');
    if(modal) modal.style.display = 'none';
};

window.saveProfile = function() {
    const nameInput = document.getElementById('user-name-input');
    if(nameInput && nameInput.value.trim() !== "") {
        const name = nameInput.value.trim();
        localStorage.setItem('moodWheel_userName', name);
        console.log("Nome utente salvato:", name);
        window.closeProfile();
        
        // Opzionale: ricarica la pagina o aggiorna la UI per mostrare il nome
        alert("Profilo aggiornato, " + name + "!");
    } else {
        alert("Inserisci un nome valido.");
    }
};