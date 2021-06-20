 let idFilm = document.querySelector("main").id
 if (document.querySelector(".favorite.fav")) {
     document.querySelector(".favorite.fav").addEventListener("click", () => {
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
                     postData({ email: "juanma@mail.co", api_id_film: idFilm.split("_")[1] }) //FALTA LA OBTENCION DEL EMAIL DE USUARIO
                         .then(() => { window.location.reload() })
                 })
             }
         })
     })
 } else {
     document.querySelector(".favorite.nofav").addEventListener("click", () => {
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
             postData({ email: "juanma@mail.co", api_id_film: idFilm.split("_")[1] }) //FALTA LA OBTENCION DEL EMAIL DE USUARIO
                 .then(() => { window.location.reload() })
         })
     })
 }