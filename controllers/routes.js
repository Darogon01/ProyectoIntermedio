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
    film: async(req, res) => {
        let title = req.params.title;
        let capitalizarPrimeraLetra = (str) => str.charAt(0).toUpperCase() + str.slice(1)
        let titleMayus = capitalizarPrimeraLetra(title);
        let data = await films.getPelicula(`http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`);
        async function opinions() {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`https://www.sensacine.com`);
            await page.waitForSelector("#didomi-notice-agree-button");
            await page.click("#didomi-notice-agree-button");
            await page.waitForSelector("#header-main-mobile-btn-search");
            await page.click("#header-main-mobile-btn-search");
            await page.waitForSelector("#header-search-input");
            await page.type("#header-search-input", titleMayus);
            await page.waitForSelector(`#search-engine > div > div > div.autocomplete-results > div > img[alt=${titleMayus}]`);
            await page.click(`#search-engine > div > div > div.autocomplete-results > div > img[alt=${titleMayus}]`);
            await page.waitForSelector(".content-txt.review-card-content");
            const coments = await page.evaluate(() => {
                const opinions = document.querySelectorAll(
                    ".content-txt.review-card-content"
                );
                const dataComent = [];
                opinions.forEach((cometarios) => {
                    dataComent.push(cometarios.innerText);
                });
                return dataComent;
            });
            return coments
        }
        let reviews = await opinions();
        res.status(200).render("film", { data, comentarios: reviews });
    },
    movies: async(req, res) => {
        // SUSTITUIR POR LA RESPUESTA DE LA BBDD DE FAVORITOS
        let arrFavoritas = ["tt1216475", "tt4029846", "tt10222892", "tt0401383"]

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