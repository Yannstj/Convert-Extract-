const pdfParse = require("pdf-parse");

exports.extractPdf = (req, res, next) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end(); // s'éxecute si le pdf n'est pas founit (bug ?)
  }
  pdfParse(req.files.pdfFile).then((result) => {
    const extractValue = [];
    //Initialisation des données à récupérer
    const dataPDF = result.text.split(" "); //split(" ") --Permet d'afficher les données demander entre guillemets et de supprimer le reste, sans ça, tout est présent
    const numSecuSocial = dataPDF.slice(140, 147);
    const regexOnlyLetters = /\w+/;
    const regexOnlyNumbers = /\d/g;

    const sexEnum = Object.freeze({
      Monsieur: "M",
      Madame: "F",
    });

    const formatted = {
      patient: {
        birthday: (function () {
          let temp = "";
          const notParsed = dataPDF[14].match(regexOnlyNumbers);
          notParsed.forEach((el) => (temp += el));
          return temp;
        })(),
        name: (function () {
          //console.log();
          const firstNameUp = dataPDF[11].toUpperCase();
          return `${
            dataPDF[11][0].toUpperCase() + dataPDF[11].toLowerCase().slice(1)
          }^${dataPDF[10].toUpperCase()}`;
        })(),
        sex: sexEnum[dataPDF[8].match(regexOnlyLetters)[0]],
        ipp: dataPDF[128],
        code_value: dataPDF[133],
        code_meaning: "INSEE",
      },
    };

    console.log(formatted);

    //Récupération du placement dans le PDF
    extractValue.push(
      dataPDF[0].match(regexOnlyLetters),
      dataPDF[4].match(regexOnlyNumbers),
      //dataPDF[6], // heure
      dataPDF[8].match(regexOnlyLetters),
      dataPDF[10],
      dataPDF[11],
      dataPDF[14].match(regexOnlyNumbers),
      dataPDF[20],
      dataPDF[21],
      dataPDF[64].match(regexOnlyLetters),
      dataPDF[128],
      dataPDF[133],
      extractValue.concat(numSecuSocial)
    );
    //Envoie vers l'affichage
    res.send(extractValue);
    //console.log("PDF UPLOAD !!!!")

    // //Affichage en console
    // console.log(dataPDF[0]);    //SITE MERAN --Pas utilise, à confirmer--
    // console.log(dataPDF[4].match(regexOnlyNumbers));    //DATE
    // //console.log(dataPDF[6]);    //HEURE --Pas utilise, à confirmer--
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
  });
};
