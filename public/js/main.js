const inpFile = document.getElementById("inpFile");
const resultText = document.getElementById("resultText");
const btnUpload = document.getElementById("btnUpload");
const btnUp = document.getElementById("modal");

@param {HTMLElement} dropZoneElement
@param {File} file

var choixModalites = ["US"]; //Default value

btnUp.addEventListener("click", () => {
  const formData = new FormData();

  formData.append("pdfFile", inpFile.files[0]);
  console.log("moda =", choixModalites);
  formData.append("moda", choixModalites);
  // console.log("FormData =", formData);
  // console.log("FormData.moda =", formData.moda);
  // console.log("FormData.pdfFile =", formData.pdfFile);

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
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // First time - there is no thumbnail element, so lets create it
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;

  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}

/**
 * Script pour les boutons de choix de Modalité
 */

window.addEventListener("load", function () {
  document
    .getElementById("btnRadiographie")
    .addEventListener("click", function () {
      btnRadiographie = true;
      choixModalites = new Array("CR");
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
      choixModalites = new Array("US", "CR");
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
