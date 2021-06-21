const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    let token
    if (req.headers.cookie) {
        token = req.headers.cookie.slice(6)
    }
    let decodedToken
    jwt.verify(token, process.env.SECRET, (err, token) => {
        if (err) {
            return res.status(401).render("401")
        } else {
            decodedToken = token
        }
    })
    if (!token || !decodedToken.id_user) {
        return res.status(401).json({
            error: 'token perdido o incorrecto'
        })
    }
    next()
}