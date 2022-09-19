const {Category} = require('../models/category')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.status(200).send('ola')
})

module.exports = router;