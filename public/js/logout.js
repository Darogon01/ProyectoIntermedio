document.getElementById("logout").addEventListener("click", () => {
    console.log(`borrada cookie`)
    Swal.fire({
        title: "",
        text: "¿Deseas salir de la app?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Salir',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            let postData = async(data) => {
                const response = await fetch('/logout', {
                    method: 'POST'
                });
                return response
            }
            postData()
                .then(() => { window.location.href = `/` })
        }
    })
})