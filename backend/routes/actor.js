/**
 * --- This file contains all the routes regarding the actor request ---
 */

const express = require('express')

const controller = require('../controller/actor')
const router = express.Router()

router.get('/', controller.getAll)
router.get('/:name', controller.getByName)

module.exports = router
