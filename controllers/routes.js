const films = require('../utils/films');
const Film = require('../models/Films')

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
    adminMovies: async(req, res) => {
        try {
            const data = await Film.find()
            res.status(200).render('movies-admin', { data })
        } catch (err) {
            res.status(400).json({ message: err.message });
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
            res.status(400).json({ message: err.message });
        }
    },
    editMovieGet: async(req, res) => {
        let id = req.params.id
        try {
            const data = await Film.find({ "filmId": id })
            res.status(200).render('editmovie', data[0])
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    editMoviePut: async(req, res) => {
        let id = req.body.filmId
        let film = req.body
        try {
            await Film.findOneAndUpdate({ "filmId": id }, film, { new: true, runValidators: true },
                (err, data) => {
                    if (err) return res.status(500).send(err.errors.urlImage.message);
                    return res.status(201).redirect(`/adminmovies`) //cambiar adminmovies por movies cuando esté listo el log de usuarios
                });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    deleteMovie: async(req, res) => {
        let id = req.query.id
        try {
            await Film.deleteOne({ "filmId": id });
            res.status(201).redirect(`/adminmovies`) //cambiar adminmovies por movies cuando esté listo el log de usuarios
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = routes