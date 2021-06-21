const router = require('express').Router()
const jwt = require('jsonwebtoken')
const pages = require('../controllers/routes')
module.exports = (req, res, next) => {
    let token
    if (req.headers.cookie) {
        token = req.headers.cookie.slice(6)
    }
    let decodedToken
    jwt.verify(token, process.env.SECRET, (err, token) => {
        decodedToken = token
    })
    if (decodedToken.isAdmin) {
        return res.status(401).render("401")
    } else {
        return next()
    }
}