/**
 * Script pour envoyé les données de modalité vers l'API
 * https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data-fr
 * https://youtu.be/cuEtnrL9-H0
 */

//Access-Control-Allow-Origin: http://10.35.135.112:4000/api/patients;
//Access-Control-Allow-Origin: http://10.35.135.112:4000/api/examens;



//Requête de test pour la connexion
const URLTEST = 'http://10.35.135.112:4000/api/patients';
fetch(URLTEST, {
    method: "GET"
    //mode: "no-cors"
}).then(function(response) {
    console.log(URLTEST);
    console.log(response);
}).catch(function(response) {
    console.log("ERROR " + URLTEST + " " + response)
});



//POST vers la partie Patients
const urlPatient = 'http://10.35.135.112:4000/api/patients'
let dataPatient = {
    birthday:"20000125",
    code_value:"1234567",
    code_meaning: "INSEE",
    name:"Catherine^MEDICIS",
    ipp: "1234567",
    sex: "F",
    id: 20
}
let fetchDataPatient = {
    method: 'POST',
    body: dataPatient,
    headers: new Headers()
}

fetch(urlPatient,fetchDataPatient).then(function() {
    console.log(urlPatient);
}).catch(function() {
    console.log("ERROR " + urlPatient)
});

//POST vers la partie Examens
const urlExamen = 'http://10.35.135.112:4000/api/examens'
let dataExamen = {
    day:"20220420",
    patient_id: 20,
    accession_number: "B00017",
    ref_physi_name: "Dr Henri Capet",
    ref_study_seq: "Rand study",
    modalities: ["US", "DX"]
}
let fetchDataExamen = {
    method: 'POST',
    body: dataExamen,
    headers: new Headers()
}

fetch(urlExamen,fetchDataExamen).then(function() {
    console.log(urlExamen);
}).catch(function() {
    console.log("ERROR " + urlExamen)
});