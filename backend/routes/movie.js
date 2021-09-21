/**
 * --- This file contains all the routes regarding the movies request ---
 */

const express = require('express')

const controller = require('../controller/movie')
const router = express.Router()

router.get('/', controller.getAll)
router.get('/url/:URL', controller.getByURL)
router.get('/title/:title', controller.getByTitle)
router.get('/name/:name', controller.getByName)
router.get('/year/:year', controller.getByYear)
router.get('/random/', controller.getRandom)
router.get('/rating/:rating', controller.getByRating)
router.post('/', controller.create)
router.delete('/url/:URL', controller.deleteByURL)
router.put('/url/:URL', controller.updateByURL)

module.exports = router
