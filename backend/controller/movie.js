/**
 * --- This file contains an implementation of the requests w.r.t. movies ---
 */

const Movie = require('../models/movie')
const errorHandler = require('../util/errorHandler')
const converterToCSV = require('../util/csvConverter')
const URL_BASE = 'https://www.imdb.com/title/'
const { nanoid } = require('nanoid')

const projection = { _id: 0, __v: 0 }

/**
 * --- Get all movies from the database, sort by popularity ---
 * ROUTE: router.get('/', controller.getAll)
 */
module.exports.getAll = async function (req, res) {
  const amount = req.query.amount
  const year = req.query.year
  const order = req.query.order
  try {
    // Main retrieval
    await Movie.find({}, projection).then(documents => {
      if (order) {
        // eslint-disable-next-line multiline-ternary
        documents.sort(order === 'descending' ? function (a, b) {
          return b.users_rating - a.users_rating
        } : function (a, b) {
          return a.users_rating - b.users_rating
        })
      }
      if (year) {
        documents = documents.filter(doc => doc.year === year)
      }
      if (amount) {
        documents = documents.slice(0, amount)
      }
      sendObject(req, res, documents)
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

/**
 * --- Get a movie by its unique URL ---
 * ROUTE: router.get('/url/:URL', controller.getByURL)
 */
module.exports.getByURL = async function (req, res) {
  // Split the URL to base and parameters
  const url = URL_BASE + req.params.URL + '/'
  try {
    // Main retrieval
    await Movie.find({ imdb_url: url }, projection).then(documents => {
      if (documents.length === 0) {
        res.status(404).json({
          message: 'not found'
        })
        return
      }
      sendObject(req, res, documents)
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

/**
 * --- Get all movies by their title ---
 * ROUTE: router.get('/title/:title', controller.getByTitle)
 */
module.exports.getByTitle = async function (req, res) {
  try {
    // Main retrieval + case insensitivity
    const regex = new RegExp(['^', req.params.title, '$'].join(''), 'i')
    await Movie.find({ title: regex }, projection)
      .then(documents => {
        if (documents.length === 0) {
          res.status(404).json({
            message: 'not found'
          })
          return
        }
        sendObject(req, res, documents)
      })
  } catch (error) {
    errorHandler(res, error)
  }
}

/**
 * --- Get all movies by the name of an actor or a director ---
 * ROUTE: router.get('/name/:name', controller.getByName)
 */
module.exports.getByName = async function (req, res) {
  // Declare variables + case insensitivity
  const role = req.query.role
  const year = req.query.year
  const regex = new RegExp(['^', req.params.name, '$'].join(''), 'i')
  const query =
    role === 'actor'
      ? { actors: regex }
      : { directors: regex }
  if (year) query.year = year
  try {
    // Main retrieval
    await Movie.find(query, projection).then(documents => {
      if (documents.length === 0) {
        res.status(404).json({
          message: 'not found'
        })
        return
      }
      sendObject(req, res, documents)
    })
  } catch (err) {
    errorHandler(res, err)
  }
}

/**
 * --- Get all movies in a specific year ---
 * ROUTE: router.get('/year/:year', controller.getByYear)
 */
module.exports.getByYear = async function (req, res) {
  // Declare variables
  const subset = req.query.subset
  const year = req.params.year
  try {
    // Main retrieval
    await Movie.find({ year: year }, projection).then(documents => {
      if (documents.length === 0) {
        res.status(404).json({
          message: 'not found'
        })
        return
      }
      // Sort and slice the data
      if (subset) {
        documents.sort(function (a, b) {
          return b.users_rating - a.users_rating
        })
        documents = documents.slice(0, subset)
      }
      sendObject(req, res, documents)
    })
  } catch (err) {
    errorHandler(res, err)
  }
}

/**
 * --- Create a movie with data specified in the req.body ---
 * ROUTE: router.post('/', controller.create)
 */
module.exports.create = async function (req, res) {
  const movie = new Movie(req.body)
  if (!movie.imdb_url) {
    console.log('gets here')
    // Generate a random URL using nanoid package
    movie.imdb_url = URL_BASE + nanoid() + '/'
  }
  // Creating a movie
  await movie.save(function (err) {
    if (err) errorHandler(res, err)
    else {
      // Movie succesfully added
      res.status(201).json({ message: 'Movie added', url: movie.imdb_url })
    }
  })
}

/**
 * --- Delete a movie by its unique URL ---
 * ROUTE: router.delete('/url/:URL', controller.deleteByURL)
 */
module.exports.deleteByURL = async function (req, res) {
  const url = URL_BASE + req.params.URL + '/'
  try {
    // Main call for delete
    await Movie.deleteOne({ imdb_url: url }).then(documents => {
      if (documents.n === 0) {
        res.status(404).json({
          message: 'not found'
        })
        return
      }
      // Return the status code
      res.status(202).json({ message: 'Marked for deletion' })
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

/**
 * --- Update a movie by its unique URL ---
 * ROUTE: router.put('/url/:URL', controller.updateByURL)
 */
module.exports.updateByURL = async function (req, res) {
  const url = URL_BASE + req.params.URL + '/'
  const updated = {}
  // Define the new data to be updated
  if (req.query.title) updated.title = req.query.title
  if (req.query.rating) updated.rating = req.query.rating
  if (req.query.year) updated.year = req.query.year
  if (req.query.users_rating) updated.users_rating = req.query.users_rating
  if (req.query.metascore) updated.metascore = req.query.metascore
  if (req.query.img_url) updated.img_url = req.query.img_url
  if (req.query.countries) updated.countries = req.query.countries
  if (req.query.languages) updated.languages = req.query.languages
  if (req.query.actors) updated.actors = req.query.actors
  if (req.query.genre) updated.genre = req.query.genre
  if (req.query.tagline) updated.tagline = req.query.tagline
  if (req.query.description) updated.description = req.query.description
  if (req.query.directors) updated.directors = req.query.directors
  if (req.query.runtime) updated.runtime = req.query.runtime
  try {
    // Find and update a movie
    await Movie.findOneAndUpdate(
      { imdb_url: url },
      { $set: updated },
      {
        new: true,
        projection: projection
      }
    ).then(document => {
      if (!document) {
        res.status(404).json({
          message: 'not found'
        })
        return
      }
      // Return results if succesfull
      res.status(200).json({ message: 'success', updatedMovie: document })
    })
  } catch (err) {
    errorHandler(err)
  }
}

/**
 * --- Get a random number of movies to watch today ---
 * ROUTE: router.get('/random', controller.getRandom)
 */
module.exports.getRandom = async function (req, res) {
  const amount = Number.parseInt(req.query.amount)
  const movieArray = []
  try {
    // Main retrieval
    await Movie.find({}, projection).then(documents => {
      let prob = Math.random()
      for (let index = 0; index < documents.length; index++) {
        if (prob > 0.97) {
          if (movieArray.push(documents[index]) === amount) break

          // if we reached a point were all the next movies should be added
          if (index - movieArray.length + amount === documents.length) prob = 1
        }
        if (prob !== 1) prob = Math.random()
      }

      sendObject(req, res, movieArray)
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

/**
 * --- Get all movies with a specific rating ---
 * ROUTE: router.get('/rating/:rating', controller.getByRating)
 */
module.exports.getByRating = async function (req, res) {
  // Declare variables
  const amount = req.query.amount
  const usersRating = Number.parseFloat(req.params.rating).toFixed(1).toString()
  try {
    // Main retrieval
    await Movie.find({ users_rating: usersRating }, projection).then(documents => {
      if (documents.length === 0) {
        res.status(404).json({
          message: 'not found'
        })
        return
      }
      if (amount) {
        documents = documents.slice(0, amount)
      }
      sendObject(req, res, documents)
    })
  } catch (err) {
    errorHandler(res, err)
  }
}

// Function for handling the sending of the objects
function sendObject (req, res, documents) {
  if (req.headers.accept === 'text/csv') {
    const csvObject = converterToCSV.convertObject(documents)
    res.setHeader('content-type', 'text/csv')
    res.status(200).send(csvObject)
    return
  }
  res.status(200).json({ message: 'success', movies: documents })
}
