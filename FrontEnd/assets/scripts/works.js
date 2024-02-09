// Déclaration des variables pour contenir les catégories et les travaux
let allWorks = []
let allCategories = []
let token = localStorage.getItem("authToken")
console.log(token)
const logStatus = document.getElementById("log")

if (token) { // Si admin car token existant (true)
    console.log("Vous êtes en mode administrateur")
    logStatus.innerHTML = "logout"
    logStatus.addEventListener("click", logOut)
    document.querySelector(".edition-bar").style.display = "flex"
    document.getElementById("edit").style.display = "flex"
    document.querySelector(".filter-buttons").style.display = "none"
} else {      // Si visiteur
    console.log("Vous êtes en mode visiteur")
    logStatus.innerHTML = "login"
}

// Fonction de déconnexion automatique après 30 minutes
function checkInactivity() {
    const currentTime = Date.now()
    const elapsedTime = currentTime - lastActionTime
    const inactivityDuration = 30 * 60 * 1000
    if (elapsedTime >= inactivityDuration) {
        logOut() // Déclencher la déconnexion automatique
    }
}
document.addEventListener("mousemove", () => {
    lastActionTime = Date.now()
});
document.addEventListener("keypress", () => {
    lastActionTime = Date.now()
})

// Fonction de déconnexion
function logOut() {
    localStorage.removeItem("authToken")
    localStorage.setItem("logoutMessage", "Vous êtes déconnecté.e")
}

// URL des fetchs
const categoriesUrl = "http://localhost:5678/api/categories"
const worksUrl = "http://localhost:5678/api/works"

// Fonction pour tout afficher
function displayAll() {
    fetchCategory();
    fetchGallery();
}

// Récupération des catégories depuis l'API
function fetchCategory() {
    fetch(categoriesUrl)
        .then(response => response.json())
        .then(data => {
            allCategories = data
            renderCategories(data)
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error))
}

// Affichage des boutons de catégorie
function renderCategories(categories) {
    const divButtons = document.querySelector(".filters")
    divButtons.innerHTML = "" // Efface les boutons précédents

    categories.forEach(category => {
        const categoryButton = document.createElement("button")
        categoryButton.innerText = category.name
        categoryButton.setAttribute("class", "category-button")
        categoryButton.setAttribute("data-id", category.id)
        divButtons.appendChild(categoryButton)
    });

    // Ajout d'un écouteur d'événements aux boutons de filtre
    const filterButtons = document.querySelectorAll(".category-button")
    filterButtons.forEach(button => {
        button.addEventListener("click", filterButtonClick)
    })
}

// Récupération des œuvres depuis l'API
function fetchGallery() {
    fetch(worksUrl)
        .then(response => response.json())
        .then(data => {
            allWorks = data
            renderGallery(data)
        })
        .catch(error => console.error('Erreur lors de la récupération des œuvres :', error))
}

// Affichage des travaux
function renderGallery(works) {
    const divGallery = document.querySelector(".gallery")
    divGallery.innerHTML = "" // Effacer l'affichage précédent

    works.forEach(work => {
        const figureWorks = document.createElement("figure")
        const imageWorks = document.createElement("img")
        const titleWorks = document.createElement("figcaption")
        imageWorks.src = work.imageUrl
        imageWorks.alt = work.title
        titleWorks.innerText = work.title
        figureWorks.appendChild(imageWorks)
        figureWorks.appendChild(titleWorks)
        divGallery.appendChild(figureWorks)
    });
}

// Filtrer les travaux
function filterButtonClick(event) {
    const categoryId = parseInt(event.target.getAttribute("data-id"));
        const filteredWorks = allWorks.filter(work => work.categoryId === categoryId);
        renderGallery(filteredWorks); // Afficher les œuvres filtrées
}

document.addEventListener("DOMContentLoaded", displayAll)

