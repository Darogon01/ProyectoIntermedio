const mongoose = require("mongoose")
const Schema = mongoose.Schema

const autoIncrement = require('mongoose-auto-increment')
let connection = mongoose.createConnection(process.env.DATABASE_URL)
autoIncrement.initialize(connection)

const filmSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    urlImage: {
        type: String,
        validate: {
            validator: (text) => text.indexOf('https://') === 0,
            message: 'La Url debe comenzar por https://'
        }
    },
    year: {
        type: Number,
        min: 1888,
        max: new Date().getFullYear() + 2
    },
    director: {
        type: String
    },
    genre: {
        type: String
    },
    runtime: {
        type: Number
    },
    registerDate: {
        type: Date,
        required: true,
        default: new Date()
    }
})

filmSchema.plugin(autoIncrement.plugin, { model: 'Film', field: 'filmId' })

const Film = mongoose.model("Film", filmSchema)
module.exports = Film