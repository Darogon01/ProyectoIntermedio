require("dotenv").config()
const express = require('express')

require('./utils/db')
const router = require("./routes/routes")

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/static', express.static(__dirname + '/public'))

app.use("/", router)

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
});