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
    createMovie: (req, res) => {
        res.status(200).render('createmovie')
    },
    createMoviePost: async(req, res) => {
        let film = req.body
        console.log(film)
        try {
            //GUARDAR EN BBDD LA PELÍCULA
            // const newProduct = await Film.save()
            // res.status(200).redirect(`/movies`)
            res.status(200).send(`Pelicula creada`) // BORRAR ESTA LINEA
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    editMovie: (req, res) => {
        let id = req.params.id
        try {
            //BUSCAR EN BBDD LA PELÍCULA
            // const data = await Film.find({ "id": id })
            // DATA DE EJEMPLO
            let data = {
                'id': id,
                'title': 'titulo',
                'urlImage': 'url imagen',
                'year': 1234,
                'runtime': 4321,
                'genre': 'genero',
                'director': 'director',
                'actors': 'actores',
                'plot': 'sinopsis'
            }
            res.status(200).render('editmovie', data)
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    editMoviePut: async(req, res) => {
        let film = req.body
        console.log(film)
        try {
            //MODIFICAR EN BBDD LA PELÍCULA
            // const newProduct = await Film.set(req.body);
            // res.status(200).redirect(`/movies`)
            res.status(200).send(`Pelicula modificada`) // BORRAR ESTA LINEA
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = routes