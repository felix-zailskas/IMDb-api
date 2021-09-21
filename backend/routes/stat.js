/**
 * --- This file contains all the routes regarding the statistics request ---
 */

const express = require('express')

const controller = require('../controller/stat')
const router = express.Router()

router.get('/:name', controller.getByName)

module.exports = router
