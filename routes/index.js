const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const record = require('./modules/record')
// const filter = require('./modules/filter')

// router.use('/filter', filter)
router.use('/record', record)
router.use('/', home)


module.exports = router