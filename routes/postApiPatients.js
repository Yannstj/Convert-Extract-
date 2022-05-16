const express = require('express')

const postApiController = require('../controllers/postApiPatients')

const router = express.Router()

router.use('/', postApiController.postOnApi)

exports.postApiRouter = router




