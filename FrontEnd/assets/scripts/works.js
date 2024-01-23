


// Récupération des travaux sur API via Fetch
fetch("http://localhost:5678/api/works")
.then(response => response.json())
.then (works => {
    console.table(works)

    for (let i = 0; i < works.length; i++) {

    const card = works[i]

    const figureFiche = document.querySelector(".gallery")
    const createFigure = document.createElement("figure")
    const imageWorks = document.createElement("img")
    imageWorks.src = card.imageUrl
    const titleWorks = document.createElement("figcaption")
    titleWorks.innerText = card.title
    

    figureFiche.appendChild(createFigure)
    createFigure.appendChild(imageWorks)
    createFigure.appendChild(titleWorks)
    }

})


