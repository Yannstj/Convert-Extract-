/**
 * Script pour les boutons de choix de Modalité
 */

//var btnRadiographie = false;

window.addEventListener('load',function(){
    document.getElementById("btnRadiographie").addEventListener('click',function(){
        btnRadiographie = true;
        console.log("SR");
    });
 });

//var btnEchographie = false;

window.addEventListener('load',function(){
    document.getElementById("btnEchographie").addEventListener('click',function(){
        btnEchographie = true;
        console.log("US");
    });
});

//var btnRadioEcho = false;

window.addEventListener('load',function(){
    document.getElementById("btnRadioEcho").addEventListener('click',function(){
        btnRadioEcho = true;
        console.log("US-SR");
    });
});

//var btnAnnuler = false;

window.addEventListener('load',function(){
    document.getElementById("btnAnnuler").addEventListener('click',function(){
        btnAnnuler = true;
        console.log(btnAnnuler);
    });
});
