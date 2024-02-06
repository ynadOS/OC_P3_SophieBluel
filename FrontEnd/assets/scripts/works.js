// Déclaration des variables pour contenir les catégories et les travaux
let allWorks = []
let allCategories = []
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
            allCategories = data;
            renderCategories(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
}

// Affichage des boutons de catégorie
function renderCategories(categories) {
    const divButtons = document.querySelector(".filters");
    divButtons.innerHTML = ""; // Effacer les boutons précédents

    categories.forEach(category => {
        const categoryButton = document.createElement("button");
        categoryButton.innerText = category.name;
        categoryButton.setAttribute("class", "category-button");
        categoryButton.setAttribute("data-id", category.id);
        divButtons.appendChild(categoryButton);
    });

    // Ajout d'un écouteur d'événements aux boutons de filtre
    const filterButtons = document.querySelectorAll(".category-button");
    filterButtons.forEach(button => {
        button.addEventListener("click", filterButtonClick);
    });
}

// Récupération des œuvres depuis l'API
function fetchGallery() {
    fetch(worksUrl)
        .then(response => response.json())
        .then(data => {
            allWorks = data;
            renderGallery(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des œuvres :', error))
}

// Affichage des travaux
function renderGallery(works) {
    const divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = "" // Effacer l'affichage précédent

    works.forEach(work => {
        const figureWorks = document.createElement("figure");
        const imageWorks = document.createElement("img");
        const titleWorks = document.createElement("figcaption");
        imageWorks.src = work.imageUrl;
        imageWorks.alt = work.title;
        titleWorks.innerText = work.title;
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

// Appeler la fonction displayAll pour le chargement de la page
displayAll();
