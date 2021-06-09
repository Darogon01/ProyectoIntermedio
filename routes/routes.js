const router = require('express').Router()
const pages = require('../controllers/routes')

router.get('/', pages.home)
router.get('/signup', pages.signup)
router.get('/dashboard', pages.dashboard)
router.get('/movies', pages.movies)
router.get('/createMovie', pages.createMovie)
router.post('/createMovie', pages.createMoviePost)

module.exports = router