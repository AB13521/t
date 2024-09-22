document.getElementById('loginButton').addEventListener('click', () => {
    const userId = document.getElementById('userId').value;

    if (userId) {
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('points').textContent = `Il vous reste ${data.points} points de fidélité.`;
            } else {
                document.getElementById('points').textContent = data.message;
            }
        })
        .catch(error => console.error('Erreur:', error));
    } else {
        alert('Veuillez entrer un identifiant utilisateur');
    }
});
