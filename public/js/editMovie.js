// CÓDIGO PARA ENVIAR LA PETICIÓN POR METODO PUT (NO CONSIGO HACER LAS VALIDACIONES DE LOS CAMPOS DEL FORMULARIO)

document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();

    console.log(e)
    let filmData = {
        filmId: e.target.elements.filmId.value,
        title: e.target.elements.title.value,
        urlImage: e.target.elements.urlImage.value,
        year: e.target.elements.year.value,
        director: e.target.elements.director.value,
        genre: e.target.elements.genre.value,
        runtime: e.target.elements.runtime.value
    }
    console.log(filmData)

    let editMovie = async(data) => {
        const response = await fetch('/editMovie', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log(response)
        if (response.status == 200) {
            window.location.href = `/adminmovies`
        } else {
            // window.location.href = `/editmovie/${e.target.elements.filmId.value}`
        }

        return response
    }
    editMovie(filmData)
        // .then(() => { window.location.href = `/adminmovies` }) //cambiar adminmovies por movies cuando esté listo el log de usuarios
})

// CÓDIGO PARA ENVIAR LA PETICIÓN POR METODO PUT (NO CONSIGO HACER LAS VALIDACIONES DE LOS CAMPOS DEL FORMULARIO)