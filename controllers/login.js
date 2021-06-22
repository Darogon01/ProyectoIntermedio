const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/Users')

const routes = {
    home: async(req, res) => {
        let url = { url: req.url };
        const email = req.body.email
        const password = req.body.password
        let userData = await User.getUser(email)
        let user = userData[0]
        const passCorrect = user ? await bcrypt.compare(password, user.password) : false
        if (!passCorrect) {
            res.status(401).render("home", {
                error: 'Email o contraseña incorrectos',
                email,
                password,
                url
            });
        }
        const dataToken = {
            id_user: user.id_user,
            email: user.email,
            isAdmin: user.isAdmin
        }
        const token = jwt.sign(dataToken, process.env.SECRET)
        res.cookie('token', token, { httpOnly: true });
        await User.updateUserToken(token, email)
        if (user.isAdmin) {
            res.status(200).redirect("/movies");
        } else {
            res.status(200).redirect("/dashboard");
        }
    },
    signup: async(req, res) => {
        let url = { url: req.url };
        const email = req.body.email
        const pass = req.body.password
        const regEmail = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/)
        const regPass = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        if (!regEmail.test(email) || !regPass.test(pass)) {
            if (!regEmail.test(email)) {
                res.status(401).render("signup", {
                    error: 'El email no es valido',
                    email,
                    pass,
                    url
                });
            } else if (!regPass.test(pass)) {
                res.status(401).render("signup", {
                    error: 'La contraseña debe contener al menos 8 caracteres (Mayúsculas, minúsculas y números)',
                    email,
                    pass,
                    url
                });
            }
        } else if (regEmail.test(email) && regPass.test(pass)) {
            const password = await bcrypt.hash(pass, 10)
            let userData = [
                email,
                password
            ]
            let user = await User.createUser(Object.values(userData))
            if (user.error) {
                res.status(400).json(user.error);
            } else {
                let userGet = await User.getUser(email)
                let userInfo = userGet[0]
                const dataToken = {
                    id_user: userInfo.id_user,
                    email: userInfo.email,
                    isAdmin: userInfo.isAdmin
                }
                const token = jwt.sign(dataToken, process.env.SECRET)
                res.cookie('token', token, { httpOnly: true });
                await User.updateUserToken(token, email)
                userData.push(token)
                res.status(200).redirect("/dashboard");
            }
        }
    },
    logout: async(req, res) => {
        if (req.headers.cookie) {
            token = req.headers.cookie.slice(6)
        }
        let decodedToken
        jwt.verify(token, process.env.SECRET, (err, token) => {
            decodedToken = token
        })
        let email = decodedToken.email

        res.clearCookie('token');
        await User.updateUserToken("token borrado", email)
        res.status(200).redirect("/");
    }
}

module.exports = routes;