const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.status(200).send('Hellow Buddy! 👋 ')
})

module.exports = router