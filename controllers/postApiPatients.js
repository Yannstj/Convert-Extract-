const axios = require('axios')


exports.postOnApi = (req ,res, next) => {
    
    const urlPatient = 'http://localhost:4000/api/patients';
    const jsonData = {patient: {birthday: "19561130", code_value: "1245235", code_meaning: "INSEE", name: "Bart^SIMPSON", ipp: "0353353", sex: "F"}};
    
    axios.post(urlPatient, jsonData)
            .then(function (response) {
            console.log(response);
            })
            .catch(function (error) {
            console.log(error);
        });
    }