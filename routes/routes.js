const router = require('express').Router()
const pages = require('../controllers/routes')

router.get('/', pages.home)
router.get('/signup', pages.signup)
router.get('/dashboard', pages.dashboard)
router.get('/movies', pages.movies)

router.get('/search', pages.search)

router.get('/createMovie', pages.createMovie)
router.post('/createMovie', pages.createMoviePost)
router.get('/editMovie/:id', pages.editMovie)
router.post('/editMovie', pages.editMoviePut) //CONSULTAR POR QUE NO FUNCIONA CON PUT
module.exports = router