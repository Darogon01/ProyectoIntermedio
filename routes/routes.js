const router = require('express').Router()
const pages = require('../controllers/routes')
const login = require('../controllers/login')
const auth = require('../middleware/userAuth')

router.get('/', pages.home)
router.post('/', login.home)

router.get('/signup', pages.signup)
router.post('/signup', login.signup)

router.get('/search', pages.search)
router.post('/search', pages.search)

router.get('/dashboard', auth, pages.dashboard)
router.get('/search/:title', pages.film)
router.get('/movies', pages.movies)
router.get('/adminMovies', pages.adminMovies) //CAMBIAR ENDPOINT CUANDO TENGAMOS ROLES DE USER Y ADMIN /movies

router.get('/createMovie', pages.createMovieGet)
router.post('/createMovie', pages.createMoviePost)

router.get('/editMovie/:id', pages.editMovieGet)
router.post('/editMovie', pages.editMoviePut) //CAMBIADO A POST PARA PODER HACER EL CONTROL DE ERRORES DEL FORMULARIO

router.delete('/removeMovie', pages.deleteMovie)

router.post('/favorite', pages.favorite)

module.exports = router