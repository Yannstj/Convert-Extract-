const pdfParse = require("pdf-parse");
const axios = require("axios");

let dataPDF;
let regexOnlyLetters;
let regexOnlyNumbers;

exports.extractPdf = (req, res, next) => {
  if (!req.files && !req.files.pdfFile) {
    res.render("Fournissez un PDF");
    res.status(400);
    res.end(); // s'éxecute si le pdf n'est pas founit (à corriger)
  }
  pdfParse(req.files.pdfFile)
    .then((result) => {
      //const extractValue = [];
      //Initialisation des données à récupérer
      dataPDF = result.text.split(" "); //split(" ") --Permet d'afficher les données demander entre guillemets et de supprimer le reste, sans ça, tout est présent
      const numSecuSocial = dataPDF.slice(140, 147);
      regexOnlyLetters = /\w+/;
      regexOnlyNumbers = /\d/g;

      const sexEnum = Object.freeze({
        Monsieur: "M",
        Madame: "F",
        Enfant: "O",
      });

      const formattedPatient = {
        patient: {
          birthday: (function () {
            let temp = "";
            const notParsed = dataPDF[14].match(regexOnlyNumbers);
            notParsed.forEach((el) => (temp += el));
            return (
              temp.substring(4, 8) + temp.substring(2, 4) + temp.substring(0, 2)
            ); // Format yyyymmdd
          })(),
          name: (function () {
            //console.log();
            const firstNameUp = dataPDF[11].toUpperCase();
            return `${dataPDF[10].toUpperCase()}^${
              dataPDF[11][0].toUpperCase() + dataPDF[11].toLowerCase().slice(1)
            }`;
          })(),
          sex: sexEnum[dataPDF[8].match(regexOnlyLetters)[0]],
          ipp: dataPDF[128],
          code_value: numSecuSocial.join(""), // recuperer num de securité social
          code_meaning: "INSEE",
        },
      };
      console.log("Modalities =", req.body.moda, typeof req.body.moda);
      console.log("Modalities list =", req.body.moda.split(","));
      console.log(formattedPatient);
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
                const notParsed = dataPDF[4].match(regexOnlyNumbers);
                notParsed.forEach((el) => (temp += el));
                return (
                  temp.substring(4, 8) +
                  temp.substring(2, 4) +
                  temp.substring(0, 2)
                );
              })(),
              patient_id: extractID,
              accession_number: dataPDF[133],
              ref_physi_name: "Dr " + dataPDF[21] + " " + dataPDF[20],
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
    });
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
// console.log(dataPDF[128]);  //IPP
// console.log(dataPDF[133]);  //ID CONSULTATION
// console.log(numSecuSocial); //NUMERO DE SÉCURITÉ SOCIAL --Format Array--
//   });
//};
