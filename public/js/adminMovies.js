document.getElementById(`createFilm`).addEventListener("click", () => {
    window.location.href = `/createMovie`
})

let listElements = document.querySelectorAll("#adminMovies li")

listElements.forEach(li => {
    let filmId = li.className
    let title = document.querySelector(`#filmID_${li.className} h2`).innerHTML

    document.getElementById(`edit_${filmId}`).addEventListener("click", () => {
        window.location.href = `/editMovie/${filmId}`
    })

    document.getElementById(`delete_${filmId}`).addEventListener("click", () => {
        Swal.fire({
            title: `¿Eliminar ${title}?`,
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Borrar',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: `Borrada`,
                    text: `${title} ha sido borrada`,
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true,
                    showClass: {
                        backdrop: 'swal2-noanimation',
                        popup: ''
                    },
                }).then(() => {
                    let deleteMovie = async(data) => {
                        const response = await fetch('/removeMovie', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
                        return response
                    }
                    deleteMovie({ id: filmId })
                        .then(() => { window.location.href = `/movies` })
                })
            }
        })
    })
})