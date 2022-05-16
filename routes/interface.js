const express = require('express')

const interfaceController = require('../controllers/interface')

const router = express.Router()

router.get('/', interfaceController.interfaceRender )

exports.interfaceRouter = router