const router = require('express').Router()
const pages = require('../controllers/routes')

router.get('/', pages.home)
router.get('/signup', pages.signup)
router.get('/search/:title', pages.film)
router.get('/dashboard', pages.dashboard)
router.get('/movies', pages.movies)

module.exports = router