let listElements = document.querySelectorAll("#usrMovies li")

listElements.forEach(li => {
    let title = document.querySelector(`#${li.id} h2`).innerHTML
    document.getElementById(li.id).addEventListener("click", () => {
        window.location.href = `/search/${title}`
    })
    document.querySelector(`.favorite.${li.id}`).addEventListener("click", () => {
        let eliminar = confirm(`Eliminar de favoritos la película ${title}`)
        if (eliminar) {
            console.log(`eliminado`)
                //LÓGICA DE ELIMINACIÓN DE FAVORITO
        }
    })
})