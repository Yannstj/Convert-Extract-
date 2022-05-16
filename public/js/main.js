// const formattedExam =
//  {
//      examen: {
//          day: "", //Format yyyymmdd
//          patient_id: 10, //recuperer celui de la res post,
//          accession_number: "A00002", // recup id consultation
//          ref_physi_name: dataPDF[20], // recuperer celui du pdf
//          ref_study_seq: "fixed",
//          modalities: ["US", "DX"] // à choisir onClick  sur le front
//      }
//  }

import PdfParse from "pdf-parse";

// {
//     "examen": {
//         "day":"20220420",
//         "patient_id": 10,
//         "accession_number": "A00002",
//         "ref_physi_name": "Dr José Valim",
//         "ref_study_seq": "fixed",
//         "modalities": ["US", "DX"]
//     }
// }

//   Liste des routes de l’API Worklist :

// V2 : Changements drastiques (cf note)

// Les routes de GET sont maintenant en deux grands groupes :

// - Patients
//     - /patients # List all patients
//     - /patients/:id #Get a patient by it’s id or return error « not found »
//     - /patients?code_value=val # Get a patient by is code_value or return null
// - Examens
//     - /examens # List all examens
//     - /examens?day=yyyymmdd # List only exam for a day
//     - /examens?day=yyyymmdd&modality=CR # List only exam for a day with modality tag used

// About posting (Extracted from Postman):

// ```
// POST patient : /api/patients

// {
//     "patient": {
//         "birthday":"19561130",
//         "code_value":"1245235",
//         "code_meaning": "INSEE",
//         "name":"Homer^SIMPSON",
//         "ipp": "0353353",
//         "sex": "M"
//     }
// }

// POST examen : /api/examens

// {
//     "examen": {
//         "day":"20220420",
//         "patient_id": 10,
//         "accession_number": "A00002",
//         "ref_physi_name": "Dr José Valim",
//         "ref_study_seq": "1.2.4.50|1.3.4.6.7.7",
//         "modalities": ["US", "DX"]
//     }
// }

// ```

// V1 :

// Les routes de GET sont en trois grands groupes :

// - Patients
//     - /patients # List all patients
// - Modalities
//     - /modalities # list all modalities
//     - /modalities?aet=DICOM1 # Get the only row matching the AET
// - Examens
//     - /examens # List all examens
//     - /examens?day=yyyymmdd # List only exam for a day
//     - //examens?day=yyyymmdd&tag=CR # List only exam for a day with modality tag used (This one has a join.)

// You can also get the information from the Worklist postman collection in the repo.

// A summary of routes can be gathered with mix phx.routes :

//        patient_path  GET     /api/patients           WorklistWeb.PatientController :index
//        patient_path  GET     /api/patients/:id       WorklistWeb.PatientController :show
//        patient_path  POST    /api/patients           WorklistWeb.PatientController :create
//        patient_path  PATCH   /api/patients/:id       WorklistWeb.PatientController :update
//                      PUT     /api/patients/:id       WorklistWeb.PatientController :update
//        patient_path  DELETE  /api/patients/:id       WorklistWeb.PatientController :delete
//       modality_path  GET     /api/modalities         WorklistWeb.ModalityController :index
//       modality_path  GET     /api/modalities/:id     WorklistWeb.ModalityController :show
//       modality_path  POST    /api/modalities         WorklistWeb.ModalityController :create
//       modality_path  PATCH   /api/modalities/:id     WorklistWeb.ModalityController :update
//                      PUT     /api/modalities/:id     WorklistWeb.ModalityController :update
//       modality_path  DELETE  /api/modalities/:id     WorklistWeb.ModalityController :delete
//         examen_path  GET     /api/examens            WorklistWeb.ExamenController :index
//         examen_path  GET     /api/examens/:id        WorklistWeb.ExamenController :show
//         examen_path  POST    /api/examens            WorklistWeb.ExamenController :create
//         examen_path  PATCH   /api/examens/:id        WorklistWeb.ExamenController :update
//                      PUT     /api/examens/:id        WorklistWeb.ExamenController :update
//         examen_path  DELETE  /api/examens/:id        WorklistWeb.ExamenController :delete

// About posting (Extracted from Postman, subject to evolution):

// ```
// POST examen : /api/examens

// {
//     "examen": {
//         "modality": "US",
//         "day":"20220420",
//         "patient_id": 37
//     }
// }

// POST patient : /api/patients

// {
//     "patient": {
//         "birthday":"19561730",
//         "insee":"000003",
//         "nom":"N3",
//         "prenom": "P3",
//         "sex": "M"
//     }
// }

// POST modality : /api/modalities

// {
//     "modality": {
//         "aet": "Voluson-e",
//         "modality": "US"
//     }
// }
// `````

const inpFile = document.getElementById("inpFile");
const btnUpload = document.getElementById("btnUpload");
const resultText = document.getElementById("resultText");

const choixModalites = [];

btnUpload.addEventListener("click", () => {
  const formData = new FormData();

  formData.append("pdfFile", inpFile.files[0]);

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

//Script Overlay

const overlay = document.querySelector("#overlay");
document.querySelector("#show-modal-btn").addEventListener("click", () => {
  overlay.style.display = "block";
});
document.querySelector("#close-modal-btn").addEventListener("click", () => {
  overlay.style.display = "none";
});

/**
 * Script pour les boutons de choix de Modalité
 */

//var btnRadiographie = false;

window.addEventListener("load", function () {
  document
    .getElementById("btnRadiographie")
    .addEventListener("click", function () {
      btnRadiographie = true;
      console.log("SR");
      choixModalites.push("SR");
    });
});

//var btnEchographie = false;

window.addEventListener("load", function () {
  document
    .getElementById("btnEchographie")
    .addEventListener("click", function () {
      btnEchographie = true;
      console.log("US");
      choixModalites.push("US");
    });
});

//var btnRadioEcho = false;

window.addEventListener("load", function () {
  document
    .getElementById("btnRadioEcho")
    .addEventListener("click", function () {
      btnRadioEcho = true;
      console.log("US-SR");
      choixModalites.push("SR");
      choixModalites.push("US");
    });
});

//var btnAnnuler = false;

window.addEventListener("load", function () {
  document.getElementById("btnAnnuler").addEventListener("click", function () {
    btnAnnuler = true;
    console.log(btnAnnuler);
  });
});

export { choixModalites };
