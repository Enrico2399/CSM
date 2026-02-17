// GESTIONE PROFILO (LOCAL STORAGE)
function openProfile() {
    document.getElementById('profile-modal').style.display = 'flex';
    const savedName = localStorage.getItem('moodWheel_userName');
    if(savedName) document.getElementById('user-name-input').value = savedName;
}

function closeProfile() {
    document.getElementById('profile-modal').style.display = 'none';
}

function saveProfile() {
    const name = document.getElementById('user-name-input').value;
    if(name.trim() !== "") {
        localStorage.setItem('moodWheel_userName', name);
        updateNavName();
        closeProfile();
    }
}

function updateNavName() {
    const savedName = localStorage.getItem('moodWheel_userName');
    const display = document.getElementById('nav-user-name');
    if(savedName && display) display.innerText = savedName;
}

function clearAllData() {
    if(confirm("Attenzione: questo cancellerà tutti i tuoi progressi e il profilo. Continuare?")) {
        localStorage.clear();
        location.reload();
    }
}

// Inizializza all'avvio
document.addEventListener('DOMContentLoaded', updateNavName);
