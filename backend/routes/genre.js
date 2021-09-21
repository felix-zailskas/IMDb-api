/**
 * --- This file contains all the routes regarding the genres request ---
 */

const express = require('express')

const controller = require('../controller/genre')
const router = express.Router()

router.get('/name/:name', controller.getByName)
router.get('/', controller.getAll)

module.exports = router
