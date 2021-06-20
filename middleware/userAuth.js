const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    const auth = req.get('authorization')
    let token = null
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        token = auth.split(' ')[1]
    }
    console.log(token)
    let decodedToken
    jwt.verify(token, process.env.SECRET, (err, token) => {
        if (err) {
            return res.status(401).json({
                error: 'token incorrecto'
            })
        } else {
            decodedToken = token
        }
    })
    if (!token || !decodedToken.id_user) {
        return res.status(401).json({
            error: 'token perdido o incorrecto'
        })
    }
    console.log(decodedToken)
    next()
}