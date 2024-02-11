let allWorks = []

let token = localStorage.getItem("authToken")
console.log(token)

if (token) { // Si admin car token existant (true)
    console.log("Vous êtes en mode administrateur")
    admin()
} else {      // Si visiteur
    console.log("Vous êtes en mode visiteur")
    visitor()   
}

// Fonction lorsqu'on est administrateur
function admin() {
    const logStatus = document.getElementById("log")
    logStatus.innerHTML = "logout" // Le bouton login devient logout
    logStatus.addEventListener("click", logOut) // Click sur logout, appel de la fonction logOut
    document.querySelector(".edition-bar").style.display = "flex" // Barre d'édition qui s'affiche
    const btnEdit = document.getElementById("edit")
    btnEdit.style.display = "flex" // Bouton "Modifier" qui apparaît
    btnEdit.addEventListener("click", openModal) // Bouton "Modifier" qui ouvre la modale
    fetchGallery() // N'affiche que les travaux
}

// Fonction lorsqu'on est un visiteur
function visitor() {
    const logStatus = document.getElementById("log")
    logStatus.innerHTML = "login"
    displayCategoriesAndGallery()
}

// Fonction de déconnexion
function logOut() {
    localStorage.removeItem("authToken")
    localStorage.setItem("logoutMessage", "Vous êtes déconnecté.e")
}

// Fonction pour tout afficher : boutons catégories + photos
function displayCategoriesAndGallery() {
    fetchCategory()
    fetchGallery()
}

// Récupération des catégories API qui appelle la fonction renderCategories (éviter une fonction trop longue)
function fetchCategory() {
    const categoriesUrl = "http://localhost:5678/api/categories"

    fetch(categoriesUrl)
        .then(response => response.json())
        .then(data => {
            allCategories = data
            renderCategories(data)
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error))
}

// Fonction pour afficher les catégories
function renderCategories(categories) {
    const divButtons = document.querySelector(".filters")
    divButtons.innerHTML = "" // Efface les boutons précédents pour pas afficher plusieurs fois les photos
    // Création du bouton de filtre "Tous"
    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.classList.add("category-button");
    allButton.setAttribute("data-id", "0"); // Valeur spécifique pour le bouton "Tous"
    divButtons.appendChild(allButton);
    //Pour chaque catégorie, créer son bouton
    categories.forEach(category => {
        const categoryButton = document.createElement("button")
        categoryButton.innerText = category.name
        categoryButton.classList.add("category-button")
        categoryButton.setAttribute("data-id", category.id)
        divButtons.appendChild(categoryButton)
    })
    // Ajout d'un écouteur d'événements aux boutons de filtre
    const filterButtons = document.querySelectorAll(".category-button")
    filterButtons.forEach(button => {
        button.addEventListener("click", filterButtonClick)
    })
}


// Récupération des oeuvres de l'API
function fetchGallery() {
    const worksUrl = "http://localhost:5678/api/works"
    fetch(worksUrl)
        .then(response => response.json())
        .then(data => {
            allWorks = data
            renderGallery(data)
            console.log(allWorks)
        })
        .catch(error => console.error('Erreur lors de la récupération des œuvres :', error))
}

// Fonction pour afficher des travaux
function renderGallery(works) {
    const divGallery = document.querySelector(".gallery")
    divGallery.innerText = "" 
    const divGalleryModal = document.querySelector(".modal-gallery")
    divGalleryModal.innerText = ""
    works.forEach(work => {
        // Affichage dans la page d'accueil
        const figureWorks = document.createElement("figure")
        const imageWorks = document.createElement("img")
        const titleWorks = document.createElement("figcaption")

        imageWorks.src = work.imageUrl
        imageWorks.alt = work.title
        imageWorks.id = work.id
        titleWorks.innerText = work.title

        figureWorks.appendChild(imageWorks)
        figureWorks.appendChild(titleWorks)
        divGallery.appendChild(figureWorks)

        const imagesWorksDiv = document.createElement("div")
        const imageWorksModal = document.createElement("img")

        // Affichage dans la modale
        const trashCan = document.createElement("button")
        imagesWorksDiv.classList.add("works-div")
        trashCan.classList.add("trash-can")
        trashCan.innerHTML = '<i class="fa-solid fa-trash-can"></i>'

        imageWorksModal.src = work.imageUrl

        divGalleryModal.appendChild(imagesWorksDiv)
        imagesWorksDiv.appendChild(imageWorksModal)
        imagesWorksDiv.appendChild(trashCan)

        // Eventlistener pour le click sur la poubelle
        trashCan.addEventListener("click", (event) => {
            event.preventDefault() // Empêche le comportement par défaut du bouton
            deleteWork(work.id)
        })
    });
}

// Fonction pour filtrer les photos
function filterButtonClick(event) {
    event.preventDefault()
    const categoryId = parseInt(event.target.getAttribute("data-id"))

        if (categoryId === 0) { // 0 est l'id affecté au bouton "Tous"
            const filteredWorks = allWorks.filter(work => work.categoryId === 1 || 2 || 3)
            renderGallery(filteredWorks)
        } else {
            const filteredWorks = allWorks.filter(work => work.categoryId === categoryId) // bouton data-id = id de la photo
            renderGallery(filteredWorks)
    }

    console.log("travaux filtrés")
}

// Fonction effacer photo
function deleteWork(imageId) {
    const deleteUrl = `http://localhost:5678/api/works/${imageId}`
    fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        fetchGallery()
        console.log("Vous avez supprimé l'image avec l'id n° " + imageId)
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error)
    });
}

// Définition de la fonction pour ouvrir la modal
function openModal() {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay");
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    const openModalBtn = document.querySelector(".btn-open")
    const closeModalBtn = document.querySelector(".btn-close")

    openModalBtn.addEventListener("click", openModal)
    closeModalBtn.addEventListener("click", closeModal)
    overlay.addEventListener("click", closeModal)
}

// Définition de la fonction pour fermer la modal
function closeModal() {
    const modal = document.querySelector(".modal")
    const overlay = document.querySelector(".overlay")
    modal.classList.add("hidden")
    overlay.classList.add("hidden")

    document.addEventListener("keydown", function (e) {
        if ((e.key === "Escape" || e.key === "Esc") && !document.querySelector(".modal").classList.contains("hidden")) {
            closeModal(e);
        }
    });
}

// Vérifier si la page se charge
window.addEventListener('beforeunload', function (event) {
    // Annuler le chargement de la page
    event.preventDefault()
    // Afficher un message à l'utilisateur
    event.returnValue = 'TEST'
})