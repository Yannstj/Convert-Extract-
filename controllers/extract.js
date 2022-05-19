const pdfParse = require("pdf-parse");
const axios = require("axios");

let dataPDF;
let regexOnlyLetters;
let regexOnlyNumbers;

let offset_site = 0;
let offset_patient = 0;
let offset_dr = 0;

let patient_name = "";
let dr_name = "";

function computeOffsetSite(dataPDF) {
  var i = 0;
  for (; dataPDF[i] != ""; i++);
  offset_site = i - 1; // Because any sitename is at least one word long
  console.log("offset site =", offset_site);
}

function computeOffsetPatient(dataPDF) {
  var i = 0;
  var j = 0;
  for (
    ;
    dataPDF[i] != "\nMonsieur" &&
    dataPDF[i] != "\nMadame" &&
    dataPDF[i] != "jeune";
    i++
  );
  console.log("Offset will begin at :", dataPDF[i]);
  i += 2; // For "" after keyword
  for (; dataPDF[i + j] != ""; j++) {
    console.log("j =", j, "and datapadf i + j =", dataPDF[i + j]);
    //patient_name += dataPDF[i + j];
    if (patient_name) patient_name = `${patient_name}^${dataPDF[i + j]}`;
    else patient_name = dataPDF[i + j];
  }
  offset_patient = j - 2; // Because any patient name is at least 2 words long
  console.log("offset patient =", offset_patient);
}

function computeOffsetDocteur(dataPDF) {
  var i = 0;
  var j = 0;
  for (; dataPDF[i] != "Consentement:\nDr"; i++);
  i++;
  for (; dataPDF[i + j] != "Salle"; j++) {
    if (dr_name) dr_name = `${dr_name}^${dataPDF[i + j]}`;
    else dr_name = dataPDF[i + j];
  }
  offset_dr = j - 2; // Because any dr is at least two word long, and loop increment is done before comparing
  console.log("offset dr =", offset_dr);
}

function computeSocialNum(dataPDF) {
  var secu = "";
  var i = 0;
  for (; dataPDF[i] != "sociale"; i++);
  i += 2; // There is ':' in another string after the keyword sociale in PDF
  secu = dataPDF.slice(i, i + 7);
  console.log(secu);
  return secu;
}

function computeIPP(dataPDF) {
  var ipp = "";
  var i = 0;
  for (; dataPDF[i] != "\nIPP"; i++);
  i += 2; // There is ':' in another string after the keyword IPP in PDF
  ipp = dataPDF[i];
  console.log(ipp);
  return ipp;
}

exports.extractPdf = (req, res, next) => {
  if (!req.files) {
    res.send("Fournissez un PDF");
    res.status(400);
    res.end(); // s'éxecute si le pdf n'est pas founit (à corriger)
  }
  pdfParse(req.files.pdfFile)
    .then((result) => {
      //const extractValue = [];
      //Initialisation des données à récupérer
      dataPDF = result.text.split(" "); //split(" ") --Permet d'afficher les données demander entre guillemets et de supprimer le reste, sans ça, tout est présent
      computeOffsetSite(dataPDF); // Set offet for site
      computeOffsetDocteur(dataPDF); //set offset for dr
      computeOffsetPatient(dataPDF);
      const numSecuSocial = computeSocialNum(dataPDF); //dataPDF.slice(140, 147);
      regexOnlyLetters = /\w+/;
      regexOnlyNumbers = /\d/g;

      const sexEnum = Object.freeze({
        Monsieur: "M",
        Madame: "F",
        Le: "O",
        La: "O",
      });

      const formattedPatient = {
        patient: {
          birthday: (function () {
            let temp = "";
            const notParsed =
              dataPDF[14 + offset_site + offset_patient].match(
                regexOnlyNumbers
              );
            notParsed.forEach((el) => (temp += el));
            return (
              temp.substring(4, 8) + temp.substring(2, 4) + temp.substring(0, 2)
            ); // Format yyyymmdd
          })(),
          name: patient_name.toUpperCase(),
          sex: sexEnum[dataPDF[8 + offset_site].match(regexOnlyLetters)[0]],
          ipp: computeIPP(dataPDF), //dataPDF[128 + offset_site],
          code_value: numSecuSocial.join(""), // recuperer num de securité social
          code_meaning: "INSEE",
        },
      };
      console.log("Modalities =", req.body.moda, typeof req.body.moda);
      console.log("Modalities list =", req.body.moda.split(","));
      //console.log(formattedPatient);
      return formattedPatient;
    })
    .then((parsedData) => {
      const urlPatient = "http://10.35.135.67:4000/api/patients";
      console.log(parsedData);
      axios
        .post(urlPatient, parsedData)
        .catch(function (error) {
          throw error;
        })
        .then(function (jsonWithId) {
          // Patient
          const extractID = jsonWithId.data.data.id;
          const formattedExam = {
            examen: {
              day: (function () {
                let temp = "";
                const notParsed =
                  dataPDF[4 + offset_site].match(regexOnlyNumbers);
                notParsed.forEach((el) => (temp += el));
                return (
                  temp.substring(4, 8) +
                  temp.substring(2, 4) +
                  temp.substring(0, 2)
                );
              })(),
              patient_id: extractID,
              accession_number: computeIPP(dataPDF),
              ref_physi_name: "Dr " + dr_name,
              ref_study_seq: "1.2.4.50|1.3.5.78",
              modalities: req.body.moda.split(","),
            },
          };
          console.log(formattedExam);
          return formattedExam;
        })
        .then((send) => {
          axios
            .post("http://10.35.135.67:4000/api/examens", send) // Post des données examens
            .catch(function (error) {
              throw error;
            });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message }); // config is good
    })
    .then(res.send("PDF envoyé"));
  //Reset globals
  dr_name = "";
  patient_nam;
  patient_name = "";
};

// Organistaion du PDF

// console.log(dataPDF[0]);    //SITE MERAN --Pas utilise, à confirmer--
// console.log(dataPDF[4].match(regexOnlyNumbers));    //DATE
// console.log(dataPDF[6]);    //HEURE --Pas utilise, à confirmer--
// console.log(dataPDF[8]);    //SEXE PATIENT
// console.log(dataPDF[10]);   //NOM PATIENT
// console.log(dataPDF[11]);   //PRENOM PATIENT
// console.log(dataPDF[14].match(regexOnlyNumbers));   //DATE DE NAISSANCE
// console.log(dataPDF[20]);   //NOM DOCTEUR
// console.log(dataPDF[21]);   //PRENOM DOCTEUR
// console.log(dataPDF[64].match(regexOnlyLetters));   //PRESCRITPION
// console.log(dataPDF[128]);  //IPP === Accession Number
// console.log(dataPDF[133]);  //ID CONSULTATION
// console.log(numSecuSocial); //NUMERO DE SÉCURITÉ SOCIAL --Format Array--
