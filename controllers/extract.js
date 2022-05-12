const parsingFunction = require('../models/extract')

exports.extractPdf = (req, res, next) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end(); // s'éxecute si le pdf n'est pas founit (bug ?)
    }
    parsingFunction.pdfLogic(req, res) // si le pdf est fournit éxecute cette function présente dans 'models/extract.js
    console.log(parsingFunction.dataArray)
};