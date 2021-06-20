const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/Users')

/*
-user
email:juanma@mail.com
password:123456

-admin
email:juanma@mail.co
password:123456
*/

const routes = {
    home: async(req, res) => {
        let url = { url: req.url };
        const email = req.body.email
        const password = req.body.password
        let userData = await User.getUser(email)
        let user = userData[0]
        console.log(user)
        const passCorrect = user ? await bcrypt.compare(password, user.password) : false
        console.log(passCorrect)
        if (!passCorrect) {
            res.status(401).render("home", {
                error: 'Email o contraseña incorrectos',
                url
            });
        }

        const dataToken = {
            id_user: user.id_user,
            email: user.email,
            isAdmin: user.isAdmin
        }
        const token = jwt.sign(dataToken, process.env.SECRET)

        res.status(201).json({
                id_user: user.id_user,
                email: user.email,
                isAdmin: user.isAdmin,
                token
            })
            // res.status(200).redirect("/dashboard");
    },
    signup: async(req, res) => {
        const email = req.body.email
        const password = await bcrypt.hash(req.body.password, 10)
        userData = [
            email,
            password
        ]
        let user = await User.createUser(Object.values(userData))
        console.log(user)
            //falta token




        res.status(200).json(userData);
    }
}

module.exports = routes;