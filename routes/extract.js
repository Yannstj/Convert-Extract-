const express = require('express')

const extractController = require('../controllers/extract')

const router = express.Router()

router.post('/', extractController.extractPdf )

exports.extractRouter = router

