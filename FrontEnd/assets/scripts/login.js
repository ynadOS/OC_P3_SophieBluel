
// ****** REGEX DU COURRIEL ********* //
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


// ******* Partie login pour accéder à la page d'accueil en mode édition ***** //
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault() // ne pas envoyer le formulaire

    // Get username and password>
    let username = document.getElementById("email").value
    let password = document.getElementById("password").value

    // You may want to perform validation here before sending the request

    // URL API LOGIN
    let apiUrl = "http://localhost:5678/api/users/login"

    // Example request using fetch
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Convertit la réponse en JSON
        } else {
            throw new Error('Identifiants invalides. Veuillez réessayer.');
        }
    })
    .then(data => {
            // Enregistrement du token dans un cookie sécurisé avec une date d'expiration
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7); // Exemple : expiration dans 7 jours
            document.cookie = `token=${data.token}; expires=${expirationDate.toUTCString()}; path=/; Secure; SameSite=Strict`; 
            
    
        //redirection vers la page d'accueil en mode édition
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error("Error:", error)
        document.getElementById("error-message").textContent = error.message || "Une erreur s'est produite. Veuillez réessayer.";
    
    })

})