/**
 * --- This file contains an implementation of the requests w.r.t. genres ---
 */

const Movie = require('../models/movie')
const errorHandler = require('../util/errorHandler')
const converterToCSV = require('../util/csvConverter')

/**
 * --- Get all genres in the DB - extra endpoint (useful for statistics) ---
 * ROUTE: router.get('/', controller.getAll)
 */
module.exports.getAll = async function (req, res) {
  try {
    // Main retrieval
    await Movie.find().then(documents => {
      let genres = new Set()
      documents.forEach(element => {
        element.genre.forEach(gen => {
          genres.add(gen)
        })
      })
      genres = Array.from(genres)
      sendObject(req, res, genres)
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

/**
 * --- Get all movie genres for a specific actor or director, optionally sorted by year ---
 * ROUTE: router.get('/name/:name', controller.getByName)
 */
module.exports.getByName = async function (req, res) {
  // Declare variables
  const role = req.query.role
  const name = req.params.name
  const year = req.query.year
  try {
    // Main retrieval
    await Movie.find().then(documents => {
      let genres = new Set()
      documents.forEach(element => {
        // Differentiate between roles
        if (role === 'director') {
          element.directors.forEach(dir => {
            if (dir.toLowerCase().includes(name.toLowerCase())) {
              element.genre.forEach(gnr =>
                genres.add({ genre: gnr, year: element.year })
              )
            }
          })
        } else if (role === 'actor') {
          element.actors.forEach(act => {
            if (act.toLowerCase().includes(name.toLowerCase())) {
              element.genre.forEach(gnr =>
                genres.add({ genre: gnr, year: element.year })
              )
            }
          })
        }
      })

      // Sorting in asc / desc order
      genres = Array.from(genres)
      if (year) {
        genres.sort(function (a, b) {
          return a.year - b.year
        })
        if (year === 'desc') {
          genres = genres.reverse()
        }
      }
      // Using set() for unique genres
      let genresNew = new Set()
      genres.forEach(el => {
        genresNew.add(el.genre)
      })
      genresNew = Array.from(genresNew)
      if (genres.length === 0) {
        res.status(404).json({
          message: 'not found'
        })
        return
      }
      sendObject(req, res, genresNew)
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

// Function for handling the sending of the objects
function sendObject (req, res, genres) {
  if (req.headers.accept === 'text/csv') {
    const csvObject = converterToCSV.convertArray(['Name'], genres)
    res.setHeader('content-type', 'text/csv')
    res.status(200).send(csvObject)
    return
  }
  res.status(200).json({ message: 'success', genre: genres })
}
