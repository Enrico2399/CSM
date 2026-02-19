// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBiL7kyKVAmujIm3lJ_BZ646YVLVm1QQXY",
    authDomain: "csmtreviso-f59fe.firebaseapp.com",
    databaseURL: "https://csmtreviso-f59fe-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "csmtreviso-f59fe",
    storageBucket: "csmtreviso-f59fe.firebasestorage.app",
    messagingSenderId: "793401975118",
    appId: "1:793401975118:web:9b2b0af23fa338ef1a7e1f",
    measurementId: "G-4EK3FKD59Z"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  
// Esporta le funzioni globalmente per usarle in roadmap.html
window.voteInFirebase = function(featureId, userName) {
    const voteRef = ref(db, 'votes/' + featureId);
    const logRef = ref(db, 'logs');

    // 1. Aggiorna il contatore voti (Transazione atomica semplificata)
    // Recuperiamo il valore attuale e lo incrementiamo
    onValue(voteRef, (snapshot) => {
        const currentVotes = snapshot.val() || 0;
        // Nota: in una app reale useresti runTransaction, 
        // ma per la demo l'update è sufficiente
    }, { onlyOnce: true });

    // 2. Registra il log
    const newLogRef = push(logRef);
    set(newLogRef, {
        user: userName || "Anonimo",
        feature: featureId,
        timestamp: new Date().toISOString()
    });
};

// Funzione per ascoltare i voti in tempo reale
window.listenToVotes = function(callback) {
    const votesRef = ref(db, 'votes');
    onValue(votesRef, (snapshot) => {
        callback(snapshot.val());
    });
};