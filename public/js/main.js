const inpFile = document.getElementById("inpFile");
const resultText = document.getElementById("resultText");
const btnUpload = document.getElementById("btnUpload");

var choixModalites = ["US"]; //Default value

btnUpload.addEventListener("click", () => {
  const formData = new FormData();

  formData.append("pdfFile", inpFile.files[0]);
  console.log("moda =", choixModalites);
  formData.append("moda", choixModalites);
  console.log("FormData =", formData);
  console.log("FormData.moda =", formData.moda);
  console.log("FormData.pdfFile =", formData.pdfFile);

  for (pair of formData.entries()) {
    console.log("Key =", pair[0], "Val =", pair[1]);
  }

  fetch("/extract-text", {
    method: "post",
    body: formData,
  })
    .then((response) => {
      return response.text();
    })
    .then((extractedText) => {
      resultText.value = extractedText.trim();
    });
});

/**
 * Script pour les boutons de choix de Modalité
 */

window.addEventListener("load", function () {
  document
    .getElementById("btnRadiographie")
    .addEventListener("click", function () {
      btnRadiographie = true;
      choixModalites = new Array("SR");
      console.log(choixModalites);
    });
});

window.addEventListener("load", function () {
  document
    .getElementById("btnEchographie")
    .addEventListener("click", function () {
      btnEchographie = true;
      choixModalites = new Array("US");
      console.log(choixModalites);
    });
});

window.addEventListener("load", function () {
  document
    .getElementById("btnRadioEcho")
    .addEventListener("click", function () {
      btnRadioEcho = true;
      choixModalites = new Array("US", "SR");
      console.log(choixModalites);
    });
});

// window.addEventListener("load", function () {
//   document.getElementById("btnAnnuler").addEventListener("click", function () {
//     btnAnnuler = true;
//     choixModalites = new Array();
//     console.log(choixModalites);
//   });
// });
