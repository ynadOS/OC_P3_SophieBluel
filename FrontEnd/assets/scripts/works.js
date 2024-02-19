let allWorks = []
const worksUrl = "http://localhost:5678/api/works"
const categoriesUrl = "http://localhost:5678/api/categories"

let token = sessionStorage.getItem("authToken")

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
    renderCategoriesAndGallery()
}

// Fonction de déconnexion
function logOut() {
    sessionStorage.removeItem("authToken")
    sessionStorage.setItem("logoutMessage", "Vous êtes déconnecté.e")
}

// Fonction pour tout afficher : boutons catégories + photos
function renderCategoriesAndGallery() {
    fetchCategory()
    fetchGallery()
}

// Récupération des catégories API qui appelle la fonction renderCategories (éviter une fonction trop longue)
function fetchCategory() {
    fetch(categoriesUrl)
        .then(response => response.json())
        .then(data => {
            allCategories = data
            renderCategories(data)
        })
        .catch(error => console.error("Erreur lors de la récupération des catégories : ", error))
}

// Fonction pour afficher les catégories
function renderCategories(categories) {
    const divButtons = document.querySelector(".filters")
    divButtons.innerHTML = "" // Efface les boutons précédents pour pas afficher plusieurs fois les photos
    // Création du bouton de filtre "Tous"
    const allButton = document.createElement("button")
    allButton.innerText = "Tous"
    allButton.classList.add("category-button")
    allButton.setAttribute("data-id", "0") // Valeur spécifique pour le bouton "Tous"
    divButtons.appendChild(allButton)
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

// Récupération des travaux de l'API
function fetchGallery() {
    fetch(worksUrl)
        .then(response => response.json())
        .then(data => {
            allWorks = data
            renderGallery(data)
            console.log(allWorks)
        })
        .catch(error => console.error("Erreur lors de la récupération des œuvres : ", error))
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
            deleteWork(work.id, work.title)
        })
    })
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
    console.log("Travaux filtrés")
}

// Fonction effacer photo
function deleteWork(imageId, imageTitle) {
    const deleteUrl = `http://localhost:5678/api/works/${imageId}`
    fetch(deleteUrl, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("La requête a échoué avec le statut : " + response.status)
        }
        fetchGallery()
        document.querySelector(".delete-message").innerText = "Vous avez supprimé la photo nommée « " + imageTitle + " » qui possède l'ID n° " + imageId
        console.log("Vous avez supprimé l'image avec l'id n° " + imageId)
    })
    .catch(error => {
        console.error("Erreur lors de la requête fetch : ", error)
    })
}

// Fonction pour ouvrir la modale
function openModal(event) {
    event.preventDefault()
    console.log("Vous avez ouvert la modale")
    const modal = document.querySelector(".modal")
    const overlay = document.querySelector(".overlay")
    const previousBtn = document.querySelector(".btn-previous")
    const divFirstModal = document.querySelector(".modal-works")
    const divSecondModal = document.querySelector(".modal-add-work")
    const addWorkBtn = document.getElementById("add-work")
    const openModalBtn = document.querySelector(".btn-open")
    const closeModalBtn = document.querySelector(".btn-close")
    // Ce qu'on cache et ce qu'on montre pour afficher la modale
    modal.classList.remove("hidden")
    overlay.classList.remove("hidden")
    divFirstModal.classList.remove("hidden")
    divSecondModal.classList.add("hidden")
    previousBtn.classList.add("hidden")

    openModalBtn.addEventListener("click", openModal)
    closeModalBtn.addEventListener("click", closeModal)
    overlay.addEventListener("click", closeModal)
    addWorkBtn.addEventListener("click", addNewWork)
}

// Fonction pour reset la modale à chaque modification
function resetModalContent() {
    const submitWorkBtn = document.getElementById("upload-btn")
    const titleInput = document.getElementById("title-input")
    const openModalBtn = document.querySelector(".btn-open")
    const fileInput = document.getElementById("file-input")
    const browseBtn = document.getElementById("browse-photo")
    const photoPreview = document.querySelector(".photo-preview")

    // On vide les champs qui ont été préalablement remplis
    openModalBtn.removeEventListener("click", openModal)
    photoPreview.classList.add("hidden")
    photoPreview.innerHTML=""
    fileInput.value = ""
    titleInput.value = ""
    browseBtn.removeEventListener("click", browseWork)
    document.querySelector(".delete-message").innerHTML = ""
    submitWorkBtn.setAttribute("disabled", "disabled")
    submitWorkBtn.style.backgroundColor = "#A7A7A7"
    document.getElementById("work-category").selectedIndex = 0 // Afficher la première catégorie par défaut
    document.querySelector(".invalid-size").innerHTML = ""
}

// Fonction pour fermer la modale
function closeModal() {
    console.log("Vous avez fermé la modale")
    const modal = document.querySelector(".modal")
    const overlay = document.querySelector(".overlay")
    const divSecondModal = document.querySelector(".modal-add-work")

    modal.classList.add("hidden")
    overlay.classList.add("hidden")
    divSecondModal.classList.remove("hidden")

    document.addEventListener("keydown", (event) => {
        if ((event.key === "Escape" || event.key === "Esc") && !document.querySelector(".modal").classList.contains("hidden")) {
            closeModal(event)
            console.log("Vous avez fermé la modale en appuyant sur ECHAP")
        }
    })
    resetModalContent()
}

// Fonction pour accéder à la 2ème page de la modale : ajout des photos
function addNewWork(event) {
    event.preventDefault()
    console.log("Vous allez ajouter un nouveau projet")
    const overlay = document.querySelector(".overlay")
    const closeModalBtn = document.querySelector(".btn-close")
    const previousBtn = document.querySelector(".btn-previous")
    const divFirstModal = document.querySelector(".modal-works")
    const divSecondModal = document.querySelector(".modal-add-work")
    const fileInput = document.getElementById("file-input")
    const imagePreview = document.querySelector(".add-works")
    const browseBtn = document.getElementById("browse-photo")
    const submitWorkBtn = document.getElementById("upload-btn")
    const photoPreview = document.querySelector(".photo-preview")
    const titleInput = document.getElementById("title-input")

    // Bbooléen image + saisie du titre. Si true, le bouton est actif et devient vert, sinon il reste gris
    function checkInputs() {
        const file = fileInput.files[0]
        const title = titleInput.value
        
        if (file && title) {
            submitWorkBtn.style.backgroundColor = "#1D6154"
            submitWorkBtn.removeAttribute("disabled")
        } else {
            submitWorkBtn.style.backgroundColor = "#A7A7A7"
            submitWorkBtn.setAttribute("disabled", true)
        }
    }

    // Ajouter un gestionnaire pour chaque champ (file et title) pour vérifier lorsqu'ils sont modifiés
    fileInput.addEventListener("change", checkInputs)
    titleInput.addEventListener("input", checkInputs)

    previousBtn.classList.remove("hidden")
    divFirstModal.classList.add("hidden")     // On cache la première div de la modale
    divSecondModal.classList.remove("hidden") // On affiche la seconde div de la modale
    photoPreview.classList.add("hidden")
    imagePreview.classList.remove("hidden")

    closeModalBtn.addEventListener("click", closeModal)
    overlay.addEventListener("click", closeModal)
    previousBtn.addEventListener("click", previousButton)
    browseBtn.addEventListener("click", browseWork)
    submitWorkBtn.addEventListener("click", submitWorkButton)
    document.addEventListener("keydown", function (event) {
        if ((event.key === "Escape" || event.key === "Esc") && !document.querySelector(".modal").classList.contains("hidden")) {
            closeModal(event)
        }
    })
}

function previousButton (event) {
    event.preventDefault()
    const previousBtn = document.querySelector(".btn-previous")
    const divFirstModal = document.querySelector(".modal-works")
    const divSecondModal = document.querySelector(".modal-add-work")

    previousBtn.classList.add("hidden")
    divSecondModal.classList.add("hidden")
    divFirstModal.classList.remove("hidden")

    resetModalContent()
    console.log("Vous revenez à la Galerie Photo")
}

// Fonction pour parcourir l'image
function browseWork(event) {
    event.preventDefault()
    const fileInput = document.getElementById("file-input")
    const imagePreview = document.querySelector(".add-works")

    console.log("Vous parcourez une photo")
    fileInput.click()
    previewImage(fileInput, imagePreview) 
}

// Fonction pour prévisualiser l'image
function previewImage(fileInput) {
    fileInput.addEventListener("change", imageUpload)
}

// Fonction pour charger l'image
function imageUpload (event) {
    event.preventDefault()
    const photoPreview = document.querySelector(".photo-preview")
    const file = event.target.files[0]
    const fileSizeInBytes = file.size
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024) // Convertir en mégaoctets (Mo)
    if (fileSizeInMegabytes < 4) {
        console.log("Vous avez soumis une photo")
        const reader = new FileReader()
        reader.onload = (event) => {
            event.preventDefault()
            const imagePreview = document.querySelector(".add-works")
            const img = document.createElement("img")

            img.src = event.target.result
            img.style.maxWidth = "100%"
            img.style.maxHeight = "100%"
            imagePreview.classList.add("hidden")
            photoPreview.classList.remove("hidden")
            photoPreview.appendChild(img)
        }

        reader.readAsDataURL(file)
    } else {
            document.querySelector(".invalid-size").innerText = "La taille du fichier dépasse la limite de 4 Mo."
}
}

// Fonction pour valider une nouvelle photo
function submitWorkButton (event) {
    event.preventDefault()
    console.log("Vous allez soumettre une photo")
    const fileInput = document.getElementById("file-input")
    const titleInput = document.getElementById("title-input")
    const idInput = document.getElementById("work-category")
    const categoryId = idInput.options[idInput.selectedIndex].getAttribute("data-cat-id")
    
    const file = fileInput.files[0]
    const title = titleInput.value

    const formData = new FormData()
    formData.append("image", file)
    formData.append("title", title)
    formData.append("category", categoryId)
    console.table(formData)
    
    formData.forEach((value, key) => {
        console.table(key, value)
    })

    fetch(worksUrl, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            'Authorization': "Bearer " + token
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Une erreur s'est produite lors de l'envoi de la photo : " + response.status)
        }
        closeModal()
        fetchGallery()
        console.log("Nouvelle image chargée avec succès !")
    })
    .then(data => {
        console.log("Réponse du serveur : ", data)
    })
    .catch(error => {
        console.error("Erreur suivante : ", error)
    })
}
