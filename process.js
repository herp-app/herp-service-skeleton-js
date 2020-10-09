/**
 * This file contains all the logic you need for your service.
 * Feel free to extend this file by others to structure more complex services.
 */
 
 function process(inputData) {
    const outputField = inputData.inputField1 + " " + inputData.inputField2;
    return outputField;
 }

 module.exports = process;