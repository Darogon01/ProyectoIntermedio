let listElements = document.querySelectorAll("#usrMovies li");

listElements.forEach((li) => {
    let title = document.querySelector(`#${li.className} h2`).innerHTML;
    document.getElementById(li.className).addEventListener("click", () => {
        document.getElementById("charge").classList.remove("hidden");
        document.querySelector(".fillspiner").classList.remove("hidden");
        window.location.href = `/search/${title}`;
    });
    let nofavs = document.querySelectorAll(`.favorite.${li.className}.nofav`);
    nofavs.forEach((film) => {
        document
            .querySelector(`.favorite.${li.className}.nofav`)
            .addEventListener("click", () => {
                Swal.fire({
                    title,
                    text: `${title} añadida a tus favoritos`,
                    icon: "success",
                    timer: 1200,
                    timerProgressBar: true,
                }).then((result) => {
                    let postData = async(data) => {
                        const response = await fetch("/favorite", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        });
                        return response;
                    };
                    let idFilm = li.className.split("_")[1];
                    postData({ api_id_film: idFilm }).then(() => {
                        document.getElementById("charge").classList.remove("hidden");
                        document.querySelector(".fillspiner").classList.remove("hidden");
                        window.location.reload();
                    });
                });
            });
    });
    let favs = document.querySelectorAll(`.favorite.${li.className}.fav`);
    favs.forEach((film) => {
        document
            .querySelector(`.favorite.${li.className}.fav`)
            .addEventListener("click", () => {
                Swal.fire({
                    title,
                    text: "¿Deseas eliminarla de tus favoritos?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Eliminar",
                    cancelButtonColor: "#d33",
                    cancelButtonText: "Cancelar",
                }).then((result) => {
                    if (result.value) {
                        Swal.fire({
                            title: `Eliminada`,
                            text: `${title} ha sido eliminada de tus favoritos`,
                            icon: "success",
                            timer: 1000,
                            timerProgressBar: true,
                            showClass: {
                                backdrop: "swal2-noanimation",
                                popup: "",
                            },
                        }).then(() => {
                            let postData = async(data) => {
                                const response = await fetch("/favorite", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(data),
                                });
                                return response;
                            };
                            let idFilm = li.className.split("_")[1];
                            postData({ api_id_film: idFilm }).then(() => {
                                document.getElementById("charge").classList.remove("hidden");
                                document.querySelector(".fillspiner").classList.remove("hidden");
                                window.location.reload();
                            });
                        });
                    }
                });
            });
    });
});

document.getElementById("btn-search").addEventListener("click", () => {
    document.getElementById("charge").classList.remove("hidden");
    document.querySelector(".fillspiner").classList.remove("hidden");
})