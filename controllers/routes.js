const films = require('../utils/film')
const Film = require('../models/Films')
const User = require('../models/Users')
const puppeteer = require("puppeteer");
let apiKey = process.env.API_KEY

const routes = {
    home: (req, res) => {
        let url = { url: req.url }
        res.status(200).render('home', url)
    },
    signup: (req, res) => {
        let url = { url: req.url }
        res.status(200).render('signup', url)
    },
    dashboard: (req, res) => {
        res.status(200).render('dashboard')
    },
    film: async (req, res) => {
    let title = req.params.title;
    let titleMayus = capitalizarPrimeraLetra(title);
    function capitalizarPrimeraLetra(str) {
      console.log(str)
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    let data = await films.getPelicula(
      `http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`
    );
    console.log(data, "data");

    async function opinionsSensa() {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(`https://www.sensacine.com`);
      await page.waitForSelector("#didomi-notice-agree-button");
      await page.click("#didomi-notice-agree-button");
      await page.waitForSelector("#header-main-mobile-btn-search");
      await page.click("#header-main-mobile-btn-search");
      await page.waitForSelector("#header-search-input");

      await page.type("#header-search-input", titleMayus);
      await page.waitForSelector(
        `#search-engine > div > div > div.autocomplete-results > div > img[alt=${titleMayus}]`
      );
      await page.click(
        `#search-engine > div > div > div.autocomplete-results > div > img[alt=${titleMayus}]`
      );
      await page.waitForSelector(".content-txt.review-card-content");
      /* const opinions = document.querySelectorAll(
            ".content-txt.review-card-content"); */
      const coments = await page.evaluate(() => {
        console.log("estamos dentro");
        const opinions = document.querySelectorAll(
          ".content-txt.review-card-content"
        );
        /* console.log(opinions); */
        const dataComentSensa = [];

        opinions.forEach((comentarios) => {
          console.log(comentarios);
          dataComentSensa.push(comentarios.innerText);
        });

        return dataComentSensa;
      });
      console.log(coments);
      return coments;
    }
    async function opinionsAfinity() {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(`https://www.filmaffinity.com/es/main.html`);
      await page.waitForSelector("#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-47sehv");
      await page.click("#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-47sehv");
      await page.waitForSelector("#top-search-input");
      await page.click("#top-search-input");
      await page.type("#top-search-input", titleMayus);
      await page.keyboard.press('Enter');
      await page.waitForSelector("#title-result > div > div:nth-child(2) > div.fa-shadow-nb.item-search > div > div.mc-poster > a > img");
      await page.click("#title-result > div > div:nth-child(2) > div.fa-shadow-nb.item-search > div > div.mc-poster > a > img");
      await page.waitForSelector('div[itemprop=reviewBody]');
      const coments = await page.evaluate(() => {
        console.log("estamos dentro");
        const opinionsAfinity = document.querySelectorAll(
          'div[itemprop=reviewBody]'
        );
        console.log(opinionsAfinity);
        const dataComentAfinity = [];

        opinionsAfinity.forEach((comentarios) => {
          console.log(comentarios);
          dataComentAfinity.push(comentarios.innerText);
        });

        return dataComentAfinity;
      });
      console.log(coments);
      return coments;
    }

    
    let reviewsSensa = await opinionsSensa();
    let reviewsAfinity = await opinionsAfinity();
    res.status(200).render("film", { data, comentarios: reviewsSensa, coments: reviewsAfinity });
  },
    movies: async(req, res) => {
        // let arrFavoritas = ["tt1216475", "tt4029846", "tt10222892", "tt0401383"]
        let favs = await User.getUserFavorites("juanma@mail.co") //FALTA LA OBTENCION DEL EMAIL DE USUARIO
        let arrFavoritas = favs.map(fav => Object.values(fav))
        let getFilms = async() => {
            let pelis = arrFavoritas.map(async(filmID) => {
                let data = await films.getPelicula(`http://www.omdbapi.com/?i=${filmID}&apikey=${apiKey}`)
                return data
            })
            return Promise.all(pelis)
        }
        let data = await getFilms()
        res.status(200).render('movies', { data })
    },
    search: async(req, res) => {
        // SUSTITUIR POR LA RESPUESTA DE LA BBDD
        let arrFavoritas = ["tt1216475", "tt4029846", "tt10222892", "tt0401383"]

        let getFilms = async() => {
            let pelis = arrFavoritas.map(async(filmID) => {
                let data = await films.getPelicula(`http://www.omdbapi.com/?i=${filmID}&apikey=${apiKey}`)
                return data
            })
            return Promise.all(pelis)
        }
        let data = await getFilms()
        res.status(200).render('search', { data })
    },
    adminMovies: async(req, res) => {
        try {
            const data = await Film.find()
            res.status(200).render('movies-admin', { data })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    },
    createMovieGet: (req, res) => {
        res.status(200).render('createmovie')
    },
    createMoviePost: async(req, res) => {
        const film = new Film(req.body)
        try {
            const newFilm = await film.save()
            res.status(201).redirect(`/adminmovies`) //cambiar adminmovies por movies cuando esté listo el log de usuarios
        } catch (err) {
            res.status(400).render('createmovie', { message: err, data: film })
        }
    },
    editMovieGet: async(req, res) => {
        let id = req.params.id
        try {
            const data = await Film.find({ "filmId": id })
            res.status(200).render('editmovie', data[0])
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    },
    editMoviePut: async(req, res) => {
        let id = req.body.filmId
        let film = req.body
        try {
            await Film.findOneAndUpdate({ "filmId": id }, film, { new: true, runValidators: true },
                (err, data) => {
                    if (err) return res.status(400).render('editmovie', { message: err, data: film })
                    return res.status(201).redirect(`/adminmovies`) //cambiar adminmovies por movies cuando esté listo el log de usuarios
                })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    },
    deleteMovie: async(req, res) => {
        let id = req.body.id
        try {
            await Film.deleteOne({ "filmId": id })
            res.status(201).redirect(`/adminmovies`) //cambiar adminmovies por movies cuando esté listo el log de usuarios
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    },
    favorite: async(req, res) => {
        let email = req.body.email
        let api_id_film = req.body.api_id_film
        try {
            let favorite = await User.searchFavorite(email, api_id_film)
            let id_film = favorite[0] != undefined ? favorite[0].id_film : false
            if (id_film) {
                console.log(`existe`)
                await User.removeFavorite(email, api_id_film)
            } else {
                console.log(`no existe`)
                await User.addFavorite(email, api_id_film)
            }
            return res.status(201).redirect(`/movies`)
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
},
deleteMovie: async(req, res) => {
  let id = req.query.id
  try {
      await Film.deleteOne({ "filmId": id })
      res.status(201).redirect(`/adminmovies`) //cambiar adminmovies por movies cuando esté listo el log de usuarios
  } catch (err) {
      res.status(500).json({ message: err.message })
  }
}
}




module.exports = routes;
