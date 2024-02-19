
// Regex courriel
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault()
    let emailInput = document.getElementById('email')
    let emailError = document.getElementById("error-message-mail")
    let email = emailInput.value.trim()
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
        event.preventDefault() // Empêche l'envoi du formulaire
        emailError.textContent = "Veuillez saisir une adresse e-mail valide."
        emailInput.focus() // Focus sur le champ d'email
    } else {
        emailError.textContent = "" // Efface le message d'erreur s'il est affiché
    }
})

// Message de déconnexion après avoir cliqué sur Logout
document.addEventListener("DOMContentLoaded", () => {
    const logoutMessage = localStorage.getItem("logoutMessage")
    const messageElement = document.getElementById("misc-message")

    if (logoutMessage) {
        messageElement.innerText = logoutMessage
        localStorage.removeItem("logoutMessage") // Effacer le message après l'avoir affiché
    }
})

// Fetch pour se connecter méthode POST
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const data = { // Données à envoyer
        email: email,
        password: password
    }
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    const loginUrl = "http://localhost:5678/api/users/login"

    fetch(loginUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error("La requête a échoué avec le statut : " + response.status)
            }
            return response.json()
        })
        .then(data => {
            sessionStorage.setItem("authToken", data.token) // Stockage du token dans la session
            sessionStorage.setItem("idUser", data.userId)
            document.getElementById("misc-message").innerText = "Connexion réussie !!!" // Inner pour notifier la connexion réussie
            window.location.href = "index.html"
        })
        .catch(error => {
            console.error("Erreur lors de la requête Fetch : ", error)
            document.getElementById("misc-message").innerText = "Erreur dans l’identifiant ou le mot de passe" // Message demandé sur le Kanban
        })
})
