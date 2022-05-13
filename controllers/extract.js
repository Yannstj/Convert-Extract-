const parsingFunction = require('../models/extract')

exports.extractPdf = (req, res, next) => {
    parsingFunction.pdfLogic(req, res) 
};