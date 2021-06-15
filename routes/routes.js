const router = require('express').Router()
const pages = require('../controllers/routes')

router.get('/', pages.home)
router.get('/signup', pages.signup)
router.get('/search/:title', pages.film)
router.get('/dashboard', pages.dashboard)
router.get('/search', pages.search)
router.get('/movies', pages.movies)
router.get('/adminMovies', pages.adminMovies) //CAMBIAR ENDPOINT CUANDO TENGAMOS ROLES DE USER Y ADMIN /movies
router.get('/createMovie', pages.createMovieGet)
router.post('/createMovie', pages.createMoviePost)
router.get('/editMovie/:id', pages.editMovieGet)
router.post('/editMovie', pages.editMoviePut) //CONSULTAR POR QUE NO FUNCIONA CON PUT
router.get('/removeMovie', pages.deleteMovie)

module.exports = router