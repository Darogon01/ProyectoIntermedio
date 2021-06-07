const router = require('express').Router()
const pages = require('../controllers/routes')

router.get('/', pages.home)

module.exports = router