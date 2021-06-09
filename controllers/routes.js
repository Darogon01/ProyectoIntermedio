const films = require('../utils/films');
require('dotenv').config();
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
        let title = req.params.title
        let data = await films.getPelicula(`http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`)
        res.status(200).render('film', data)
    },
    movies: async(req, res) => {
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

        


    }
}

module.exports = routes