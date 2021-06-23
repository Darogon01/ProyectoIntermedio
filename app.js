const express = require('express')
const passport = require('passport')

require('./passport')(passport)
require('./utils/db')
const router = require("./routes/routes")
const auth = require("./routes/auth")

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

app.use(express.json())

app.use('/static', express.static(__dirname + '/public'))

app.use('/auth', auth)
app.use("/", router)

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
});