const express = require('express')


const extractController = require('../controllers/extract')

const router = express.Router()

router.post('/extract-text', extractController.extractPdf )

exports.extractRouter = router

