
//const bodyParser = require("body-parser");
const express = require("express");
const fileUpload = require("express-fileupload");


const interfaceRoutes = require('./routes/interface')
const extractRoutes = require('./routes/extract')
const postApiPatientRoutes = require('./routes/postApiPatients')


const app = express();


app.set('view engine', 'ejs'); //setup view engine
app.set('views', 'views'); 
app.use("/", express.static("public"));


app.use(fileUpload());

app.use(interfaceRoutes.interfaceRouter)
app.use(extractRoutes.extractRouter)
app.use(postApiPatientRoutes.postApiRouter)

app.listen(8080);
