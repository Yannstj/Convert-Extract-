
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
        const regexSiteName = /[^\s]+/
        const regexDateExam = /Le(.*)à/

        res.write(regexSiteName.exec(result.text));
        res.end(regexDateExam.exec(result.text));
        res.send(dataArray.push(result.text));
         res.writeHead(302)
        //res.sendStatus(200)
        console.log(dataArray)
        
    });
    
});

app.listen(5500);



// function splitStr(str) {
      
//     // Function to split string
//     const string = str.split("+");
      
//     console.log(string);
// }
  
// // Initialize string
// var str = "Welcome*to*GeeksforGeeks";
  
// // Function call
// splitStr(str);  