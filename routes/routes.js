const router = require('express').Router()
const pages = require('../controllers/routes')
const login = require('../controllers/login')
const auth = require('../middleware/userAuth')
const isAdmin = require('../middleware/isAdmin')
const isUser = require('../middleware/isUser')

router.get('/', pages.home)
router.post('/', login.home)

router.get('/signup', pages.signup)
router.post('/signup', login.signup)

router.get('/search', auth, isUser, pages.search)
router.post('/search', auth, isUser, pages.search)

router.get('/dashboard', auth, isUser, pages.dashboard)
router.get('/search/:title', auth, isUser, pages.film)
router.get('/movies', auth, pages.movies)

router.get('/createMovie', auth, isAdmin, pages.createMovieGet)
router.post('/createMovie', auth, isAdmin, pages.createMoviePost)

router.get('/editMovie/:id', auth, isAdmin, pages.editMovieGet)
router.post('/editMovie', auth, isAdmin, pages.editMoviePut) //CAMBIADO A POST PARA PODER HACER EL CONTROL DE ERRORES DEL FORMULARIO

router.delete('/removeMovie', auth, isAdmin, pages.deleteMovie)

router.post('/favorite', auth, pages.favorite)
router.post('/logout', auth, login.logout)

router.get('*', auth, pages.error404)

module.exports = router