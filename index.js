
const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");

const app = express();

const dataArray = []

app.use("/", express.static("public"));
app.use(fileUpload());

app.post("/extract-text", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
    }

    pdfParse(req.files.pdfFile).then(result => {
        const siteName = /[^\s]+/

        res.send(siteName.exec(result.text));
        dataArray.push(result.text);
        console.log(dataArray)
    });
    
});

app.listen(5500);