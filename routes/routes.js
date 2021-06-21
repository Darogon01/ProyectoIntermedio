const router = require('express').Router()
const pages = require('../controllers/routes')
const login = require('../controllers/login')
const auth = require('../middleware/userAuth')
const isAdmin = require('../middleware/isAdmin')
const isUser = require('../middleware/isUser')

// --------- LOGIN & LOGOUT --------- //

router.get('/', pages.home)
router.post('/', login.home)

router.get('/signup', pages.signup)
router.post('/signup', login.signup)

router.post('/logout', auth, login.logout)

// --------- USER ENDPOINTS --------- //

router.get('/search', auth, isUser, pages.search)
router.post('/search', auth, isUser, pages.search)

router.get('/dashboard', auth, isUser, pages.dashboard)
router.get('/search/:title', auth, isUser, pages.film)
router.post('/favorite', auth, isUser, pages.favorite)
router.get('/movies', auth, pages.movies)

// --------- ADMIN ENDPOINTS --------- //

router.get('/createMovie', auth, isAdmin, pages.createMovieGet)
router.post('/createMovie', auth, isAdmin, pages.createMoviePost)

router.get('/editMovie/:id', auth, isAdmin, pages.editMovieGet)
router.post('/editMovie', auth, isAdmin, pages.editMoviePut) //CAMBIADO A POST PARA PODER HACER EL CONTROL DE ERRORES DEL FORMULARIO

router.delete('/removeMovie', auth, isAdmin, pages.deleteMovie)

// --------- ERROR 404 --------- //

router.get('*', auth, pages.error404)

module.exports = router