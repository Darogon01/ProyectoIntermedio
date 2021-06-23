let idFilm = document.querySelector("main").id
document.querySelector(".favorite").addEventListener("click", () => {
    let favoriteBtn = document.getElementsByClassName('favorite')
    let state = favoriteBtn[0].classList[2]
    if (state == 'fav') {
        let title = document.querySelector(`.containersearchfilm h2`).innerHTML
        Swal.fire({
            title: "",
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
                    timer: 1000,
                    timerProgressBar: true,
                    showClass: {
                        backdrop: 'swal2-noanimation',
                        popup: ''
                    },
                }).then(() => {
                    let postData = async(data) => {
                        const response = await fetch('/favorite', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
                        return response
                    }
                    postData({ api_id_film: idFilm.split("_")[1] })
                        .then(() => {
                            document.getElementById("charge").classList.remove("hidden");
                            document.querySelector(".fillspiner").classList.remove("hidden");
                            document.getElementsByClassName('favorite')[0].classList.remove('fav');
                            document.getElementsByClassName('favorite')[0].classList.add('nofav');
                            favoriteBtn[0].innerHTML = '<img id="heart" src="../static/img/nofavorite.svg" alt="favorite icon"></img>'
                            document.getElementById("charge").classList.add("hidden");
                            document.querySelector(".fillspiner").classList.add("hidden");
                        })
                })
            }
        })
    } else {
        let title = document.querySelector(`.containersearchfilm h2`).innerHTML
        Swal.fire({
            title: `${title}`,
            text: `${title} añadida a tus favoritos`,
            icon: 'success',
            timer: 1200,
            timerProgressBar: true,
        }).then((result) => {
            let postData = async(data) => {
                const response = await fetch('/favorite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                return response
            }
            postData({ api_id_film: idFilm.split("_")[1] })
                .then(() => {
                    document.getElementById("charge").classList.remove("hidden");
                    document.querySelector(".fillspiner").classList.remove("hidden");
                    document.getElementsByClassName('favorite')[0].classList.remove('nofav');
                    document.getElementsByClassName('favorite')[0].classList.add('fav');
                    favoriteBtn[0].innerHTML = '<img id="heart" src="../static/img/favorite.svg" alt="favorite icon"></img>'
                    document.getElementById("charge").classList.add("hidden");
                    document.querySelector(".fillspiner").classList.add("hidden");
                })
        })
    }
})