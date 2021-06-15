let listElements = document.querySelectorAll("#usrMovies li")

listElements.forEach(li => {
    let title = document.querySelector(`#${li.className} h2`).innerHTML
    document.getElementById(li.className).addEventListener("click", () => {
        window.location.href = `/search/${title}`
    })
    document.querySelector(`.favorite.${li.className}`).addEventListener("click", () => {
        Swal.fire({
            title,
            text: "¿Deseas eliminarla de tus favoritos?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: `Eliminada`,
                    text: `${title} ha sido eliminada de tus favoritos`,
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showClass: {
                        backdrop: 'swal2-noanimation',
                        popup: ''
                    },
                }).then(() => {
                    console.log(`Eliminada`)
                        // LÓGICA DE ELIMINACIÓN
                })
            }
        })
    })
})