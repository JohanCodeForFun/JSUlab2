// Description
// 1. Funktioner för att visa graf med Chart.js
// 2. Hämta element att jobba med
// 3. Hämta väderdata funktioner
// 4. Visa väderdata
// 4.
// 5.

import { GetAllWeatherData, CheckDateTime } from "./weather.js";


// 2. Hämta element att jobba med
const weatherDataSection = document.querySelector("#weatherDataSection");

// Här skulle man istället ha appendat till en tom-div för att få detta ännu mer dynamiskt om det exempelvis skulle vara 20 location eller 100 locations.
let locationElements = []
const locationTana = document.querySelector('#locationTana');
const locationLofoten = document.querySelector('#locationLofoten');
const locationHallingdalselva = document.querySelector('#locationHallingdalselva');

locationElements.push(locationTana)
locationElements.push(locationLofoten)
locationElements.push(locationHallingdalselva)

const imageIconElement = document.querySelector("#weatherImage");
// Admin Elements
let fishDescriptionElement = document.querySelector('#fishDescription')
let adminImageElement = document.querySelector('#admin-image')
let userDescriptionElement = document.querySelector('#userDescription')

let destinationElement = document.querySelector('#destination')
let startpointElement = document.querySelector('#startpunkt')
let vechileElement = document.querySelectorAll('input[type="radio"]')

let equipementElement = document.querySelector('#equipement')
let guideElement = document.querySelector('#guide')


// 2. Hämta data från user till annan sida

let nightCount = document.querySelector('#nightCount')
let counterValue = 1

let decreaseButton = document.getElementById("decrease");
// decreaseButton.disabled = true;
// // counterValue.textContent = 1; //Bestämmer startvärdet
// document.querySelector("#increase").addEventListener("click", () => {
//     counterValue++;
//     nightCount.innerHTML = counterValue
//     if(counterValue > 1) {
//       decreaseButton.disabled = false;
//     }
// });

// document.querySelector("#decrease").addEventListener("click", () => {
//   counterValue--;
//   nightCount.innerHTML = counterValue
//   if (counterValue === 1) {
//     decreaseButton.disabled = true;
//   }
// });

function CounterPrice() {
  console.log(destinationElement.value);
  console.log(startpointElement.value);
  if(equipementElement.checked) {
    equipementElement.value = "2000"
  }
  else {
    equipementElement.value = "no-equipement"
  }

  if(guideElement.checked) {
    guideElement.value = "500"
  }
  else {
    guideElement.value = "no-guide"
  }

  console.log(equipementElement.value)
  console.log(guideElement.value)

  for(let i = 0; i < vechileElement.length; i++) {
    let isChecked = vechileElement[i].checked
    if(isChecked === true) {
      window.location.href = `http://127.0.0.1:5501/fiskeplatser.html?destination=${destinationElement.value}&startpoint=${startpointElement.value}&vechile=${vechileElement[i].value}&equipement=${equipementElement.value}&guide=${guideElement.value}&night=${counterValue}`
    }
  }
}



/*
  Denna funktion, hämtar all väderData på ett interval exempelvis varje 5 sekunder hämta api datat. Sorterar väder-datat. Funktionen "checkDateTime" den kollar vilken den lokala tiden är alltså vad är klockan nu? jämförelse vad det är för tid på datat vi får på vädret. Om klockan är 12:34 och i vårat objekt har vi tiden 12:00 och vädret för denna tidslag. Så kommer detta objekt att sättas och displays "realtid" för varje timme, vad det är för väder just för denna timme.
*/
function IntervalLoop() {
  setInterval(() => {
    GetAllWeatherData()
    CheckDateTime()
    }, 900000) //  900000 milisecounds, 15min interval update
}
GetAllWeatherData()   // Hämtar all väder-data och sorterar allting
CheckDateTime()       // Kollar vilket specifikt väder-objekt vi ska ta
IntervalLoop() // This function is asyncroumus

// Admin-uploads
fetch('db.json')
.then(response => response.json())
.then(result => {
  fishDescriptionElement.innerHTML += `
    ${result.adminUpload[0].name} är en av våra många glada besökare,
    här har fångats ${result.adminUpload[0].fishType}, med en vikt på hela ${result.adminUpload[0].fishWeight}
  `
  adminImageElement.setAttribute('src', `${result.adminUpload[0].image}`)
  userDescriptionElement.innerHTML += `"${result.adminUpload[0].textDescription}"`
})
