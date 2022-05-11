const express = require('express')


const extractController = require('../controllers/extract')

const router = express.Router()

router.use('/', extractController.extractPdf )

exports.extractRouter = router

