/**
 * --- This file serves as the basis for our project. It handles connection to the database and puts all the packages together ---
 */

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const DB_URI = 'mongodb://localhost/movies'
const dataset = require('../datasets/movie.json/movie.json')
const Movie = require('./models/movie')

const movieRoutes = require('./routes/movie')
const actorRoutes = require('./routes/actor')
const genreRoutes = require('./routes/genre')
const statRoutes = require('./routes/stat')

app.use(bodyParser.json())
app.use(cors())
app.use(require('morgan')('dev')) // HTTP request logger

// Connect to the database
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Connected to DB')
  })

// Command for preloading the dataset in the DB
Movie.insertMany(dataset, function (err) {
  if (err) console.log('The data is already inserted in the database')
})

app.use('/api/movies', movieRoutes)
app.use('/api/actors', actorRoutes)
app.use('/api/genres', genreRoutes)
app.use('/api/statistics', statRoutes)

module.exports = app
