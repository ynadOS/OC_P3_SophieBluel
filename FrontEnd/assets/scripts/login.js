
// [[[[[[[ REGEX courriel ]]]]]]] //
document.getElementById("loginForm").addEventListener("submit", function(event) {
    let emailInput = document.getElementById('email')
    let emailError = document.getElementById("error-message-mail")
    let email = emailInput.value.trim()
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Regex pour email

    if (!emailRegex.test(email)) {
        event.preventDefault() // Empêche l'envoi du formulaire
        emailError.textContent = "Veuillez saisir une adresse e-mail valide."
        emailInput.focus() // Focus sur le champ d'email
    } else {
        emailError.textContent = "" // Efface le message d'erreur s'il est affiché
    }
})

// [[[[[[[ Message de déconnexion lors du logout ]]]]]]] //
document.addEventListener("DOMContentLoaded", function() {
    const logoutMessage = localStorage.getItem("logoutMessage")
    const messageElement = document.getElementById("misc-message")

    if (logoutMessage) {
        messageElement.innerText = logoutMessage
        localStorage.removeItem("logoutMessage") // Effacer le message après l'avoir affiché
    }
});

// [[[[[[[ Fonction pour déconnecter l'admin après 30 minutes ]]]]]]] //
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault() // Empêcher le formulaire de soumettre normalement

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    // Données à envoyer
    const data = {
        email: email,
        password: password
    };

    // Options pour la requête Fetch
    const options = {
        method: "POST", // Méthode HTTP (POST)
        headers: {
            "Content-Type": 'application/json' // Indiquer que le contenu est au format JSON
        },
        body: JSON.stringify(data) // Convertir les données en format JSON
    };

    // URL de votre endpoint d'authentification
    const loginUrl = "http://localhost:5678/api/users/login"

    // Effectuer la requête Fetch
    fetch(loginUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('La requête a échoué avec le statut ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Stocker le token dans le localStorage
            localStorage.setItem("authToken", data.token)
            // Afficher un message de succès ou rediriger l'utilisateur, etc.
            document.getElementById("misc-message").innerText = "Connexion réussie !!!"
            window.location.href = "index.html"
        })
        .catch(error => {
            console.error('Erreur lors de la requête Fetch:', error);
            // Afficher un message d'erreur à l'utilisateur, etc.
            document.getElementById("misc-message").innerText = "Erreur d'authentification, veuillez réessayer"
        })
})
