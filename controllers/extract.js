const parsingFunction = require('../models/extract')

exports.extractPdf = (req, res, next) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
    }
    parsingFunction()
   
    };