/**
 * --- This file contains an implementation of the requests w.r.t. actors ---
 */

const Movie = require('../models/movie')
const errorHandler = require('../util/errorHandler')
const converterToCSV = require('../util/csvConverter')

/**
 * --- Get all actors from the database ---
 * ROUTE: router.get('/', controller.getAll)
 */
module.exports.getAll = async function (req, res) {
  try {
    // Main retrieval
    await Movie.find().then(documents => {
      let actors = new Set()
      documents.forEach(element => {
        element.actors.forEach(actor => {
          actors.add(actor)
        })
      })
      actors = Array.from(actors)
      sendObject(req, res, actors)
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

/**
 * --- Get an actor by Name ---
 * ROUTE: router.get('/:name', controller.getByName)
 */
module.exports.getByName = async function (req, res) {
  try {
    // Main retrieval
    await Movie.find().then(documents => {
      let actors = new Set()
      documents.forEach(element => {
        element.actors.forEach(actor => {
          actors.add(actor)
        })
      })
      actors = Array.from(actors)
      actors = actors.filter(act => act.toLowerCase().includes(req.params.name.toLowerCase()))
      if (actors.length === 0) {
        res.status(404).json({
          message: 'not found'
        })
        return
      }
      sendObject(req, res, actors)
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

// Function for handling the sending of the objects
function sendObject (req, res, actors) {
  if (req.headers.accept === 'text/csv') {
    const csvObject = converterToCSV.convertArray(['Name'], actors)
    res.setHeader('content-type', 'text/csv')
    res.status(200).send(csvObject)
    return
  }
  res.status(200).json({ message: 'success', actors: actors })
}
