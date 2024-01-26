

let allWorks = []
let allCategories = []
///////////// FUSION DES FONCTIONS A AFFICHER/////////////////
function fetchAll() {
  fetchCategory();
  fetchGallery();
}
function fetchCategory() {
  fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(data => {
    // Afficher toutes les boutons
    allCategories = data
    renderCategories(data)
    console.table(data)
  })
  .catch(error => console.error('Erreur lors de la récupération des images:', error));

}
function renderCategories(categories) {
  categories.forEach(category => {
  const divButtons = document.querySelector(".filters")
  const categoryButton = document.createElement("button")

  categoryButton.innerText = category.name
  categoryButton.setAttribute("class", "category-button")
  categoryButton.setAttribute("data-id", category.id)

  divButtons.appendChild(categoryButton)

  })
}
function fetchGallery() {
    fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(data => {
        // Afficher toutes les images
        allWorks = data
        renderGallery(data)
        console.table(data)
      })
      .catch(error => console.error('Erreur lors de la récupération des images:', error));
}
function renderGallery(works) {

    document.querySelector(".gallery").innerHTML=""

    works.forEach(work => {
      const divGallery = document.querySelector(".gallery")
      const figureWorks = document.createElement("figure")
      const imageWorks = document.createElement("img")
      const titleWorks = document.createElement("figcaption")
      // Définition de chaque élément
      imageWorks.src = work.imageUrl
      imageWorks.alt = work.title
      titleWorks.innerText = work.title
      // Création des enfants
      divGallery.appendChild(figureWorks)
      figureWorks.appendChild(imageWorks)
      figureWorks.appendChild(titleWorks) 
      })

      // Ajout d'un gestionnaire d'événements au bouton
      const filterButtons = document.querySelectorAll(".category-button")
      filterButtons.forEach(button => {
        button.addEventListener("click", () => {
          const valueIdButton = parseInt(button.getAttribute("data-id"))
          console.log(valueIdButton)
          const filtered = allWorks.filter((work) => work.categoryId === valueIdButton)
          console.table(filtered)
          // Vider la page avant d'afficher le filtre
          document.querySelector(".gallery").innerHTML=""
          renderGallery(filtered)
        })
      })
}

fetchAll()


