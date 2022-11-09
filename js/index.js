// Description
// 1. Funktioner för att visa graf med Chart.js
// 2. Hämta element att jobba med
// 3. Hämta väderdata funktioner
// 4. Visa väderdata
// 4.
// 5.



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


// 2. Hämta data från user till annan sida
function CounterPrice() {
  console.log(destinationElement.value);
  console.log(startpointElement.value);
  for(let i = 0; i < vechileElement.length; i++) {
    let isChecked = vechileElement[i].checked
    if(isChecked === true) {
      window.location.href = `http://127.0.0.1:5501/fiskeplatser.html?destination=${destinationElement.value}&startpoint=${startpointElement.value}&vechile=${vechileElement[i].value}`
    }
  }
}




// 3. Hämta väderdata funktioner
// Header för att identifiera oss mot weather api, yr.no
let headers = new Headers({
  "User-Agent": "jhellberg.com johan@jhellberg.com",
});

async function GetAllWeatherData() {
  result = await Promise.all([
    {"Tana" : await (await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.43112&lon=6.24668', {
      method: 'GET',
      headers: headers
})).json()},
    {"Lofoten" : await (await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=68.04534&lon=13.38235', {
      method: 'GET',
      headers: headers
})).json()},
    {"Hallingdalselva" : await (await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.42843&lon=9.38549', {
      method: 'GET',
      headers: headers
})).json()}
])
  // Gör att denna array bara består av nyckeln-värdet av locationen alltså locationKeyInput-arrayn
  let locationKeyInput = []; // Här har jag alla keys som jag behöver

  // Denna kollar om många områden som finns som vi hämtar
  for(let i = 0; i < result.length; i++) {
    if(result[i].hasOwnProperty(result[i]) !== undefined) {
      locationKeyInput.push(Object.keys(result[i]))
    }
    console.log(locationKeyInput);
  }

  // Object.keys-funktion will return a array and locationKey is a array too
  // locationKeyInput är redan en array och Object.keys returnar också en array därför i detta fall använder jag mig av funktionen-flat som gör dessa till värden istället för arrays
  let locationKey = locationKeyInput.flat()
  console.log(locationKey);

  // Pushar in objekt till arrayn weatherData, så många som det finns location
  let weatherData = [];
  for(let i = 0; i < result.length; i++) {
    weatherData.push({[locationKey[i]]: {data: [], updatedWeatherReport: {}}})
  }
  // console.log(weatherData);

  // Genom denna loop får vi det uppdaterade-väder-raporten för just det specifika location
  for(let i = 0; i < result.length; i++) {
    let updatedDate = result[i][locationKey[i]].properties.meta.updated_at.slice(0,10)
    // console.log(updatedDate);
    let currenTimeIndex = result[i][locationKey[i]].properties.meta.updated_at.indexOf(':')
    // console.log(currenTimeIndex);

    updatedTimeFinal = result[i][locationKey[i]].properties.meta.updated_at.slice(currenTimeIndex - 2, currenTimeIndex + 3)

    weatherData[i][locationKey[i]].updatedWeatherReport.time = updatedTimeFinal;
    weatherData[i][locationKey[i]].updatedWeatherReport.date = updatedDate;
  }

  for(let i = 0; i < result.length; i++) {
    for(let j = 0; j < result[i][locationKey[i]].properties.timeseries.length; j++) {
      if(result[i][locationKey[i]].properties.timeseries[j].data?.next_1_hours !== undefined) {
        let weatherSymbol = result[i][locationKey[i]].properties.timeseries[j].data.next_1_hours.summary.symbol_code

        //IndexTime
        let timeIndex = result[i][locationKey[i]].properties.timeseries[j].time.indexOf("T")
        //TIME
        let time = result[i][locationKey[i]].properties.timeseries[j].time.lastIndexOf(":")
        // TIME FInal
        let timeFinal = result[i][locationKey[i]].properties.timeseries[j].time.slice(timeIndex + 1, time)

        let dateFinal = result[i][locationKey[i]].properties.timeseries[j].time.slice(0, 10)

        let weatherDetail = result[i][locationKey[i]].properties.timeseries[j].data.instant.details

        weatherData[i][locationKey[i]].data.push({
          "Weather-Details": weatherDetail,
          "Weather-Symbol": weatherSymbol,
          date: dateFinal,
          time: timeFinal
        })
      }
    }
  }
  localStorage.setItem('weatherDataFinal', JSON.stringify(weatherData))
  // SLUT PÅ FUNKTIONEN
}

// Function Jämnför den lokala tiden med tiden med väder-arrayn
function CheckDateTime() {
  let dateToday = new Date().toLocaleDateString();
  let timeToday = new Date().toLocaleTimeString();

  let weatherDataFinal = JSON.parse(localStorage.getItem('weatherDataFinal'))
  let locationKeys = JSON.parse(localStorage.getItem('locationKeys'))
  // 3 deklarerade väder-iconer
  let weatherIcon = [];

  // Här så splitar jag varje tid på weatherData-arrayn och jämför om det är rätt datum och tid
  for(let i = 0; i < weatherDataFinal.length; i++) {
    console.log(weatherDataFinal);
    console.log(weatherDataFinal[0]);
    console.log(weatherDataFinal[0][locationKeys[0]])
    for(let j = 0; j < weatherDataFinal[i][locationKeys[i]].data.length; j++) {

      let ArrayindexTime = weatherDataFinal[i][locationKeys[i]].data[j].time.indexOf(":");

      let ArraytimeNow = weatherDataFinal[i][locationKeys[i]].data[j].time.slice(0, ArrayindexTime);

      let currentTimeIndex = timeToday.indexOf(":");
      let currentTime = timeToday.slice(0, currentTimeIndex);

      // Kollar rätt tid för arrayn och för den lokala tiden
      // Denna kommer ju bli sant 3 gånger, för vi har 3 olika locations
      if (ArraytimeNow === currentTime && weatherDataFinal[i][locationKeys[i]].data[j].date === dateToday) {
        // Här kollar jag om våran array innehåller denna symbol och om det gör det så kollar vi också här i switchen vilken location det är. Sedan pushar vi in detta. Locationen kan bara vara sant 1 på i för vi har bara 3 location så tittar efter och så kan bara j också vara sant 1 gång för det är ju den nuvarande tiden så kommer va densamma. Därför blir det 3 gånger rätt på denna if-sats som vi sedan pushar in i arrayn-weatherIcon.
        switch(weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Symbol"]) {
        case "partlycloudy_night":
          if(locationKeys[i] === "Tana") {
            weatherIcon.push("partlycloudy_night")
          }
          else if(locationKeys[i] === "Lofoten ") {
            weatherIcon.push("partlycloudy_night")
          }
          else if (locationKeys[i] === "Hallingdalselva"){
            weatherIcon.push("partlycloudy_night")
          }
          break;
        case "fair_night":
          if(locationKeys[i] === "Tana") {
            weatherIcon.push("fair_night")
          }
          else if(locationKeys[i] === "Lofoten ") {
            weatherIcon.push("fair_night")
          }
          else if (locationKeys[i] === "Hallingdalselva"){
            weatherIcon.push("fair_night")
          }
          break;
        case "partlycloudy_day":
          if(locationKeys[i] === "Tana") {
            weatherIcon.push("partlycloudy_day")
          }
          else if(locationKeys[i] === "Lofoten ") {
            weatherIcon.push("partlycloudy_day")
          }
          else if (locationKeys[i] === "Hallingdalselva"){
            weatherIcon.push("partlycloudy_day")
          }
          break;
        case "cloudy":
          if(locationKeys[i] === "Tana") {
            weatherIcon.push("cloudy")
          }
          else if(locationKeys[i] === "Lofoten ") {
            weatherIcon.push("cloudy")
          }
          else if (locationKeys[i] === "Hallingdalselva"){
            weatherIcon.push("cloudy")
          }
          break;
        case "lightrain":
          if(locationKeys[i] === "Tana") {
            weatherIcon.push("lightrain")
          }
          else if(locationKeys[i] === "Lofoten ") {
            weatherIcon.push("lightrain")
          }
          else if (locationKeys[i] === "Hallingdalselva"){
            weatherIcon.push("lightrain")
          }
          break;
        case "heavyrain":
          if(locationKeys[i] === "Tana") {
            weatherIcon.push("heavyrain")
          }
          else if(locationKeys[i] === "Lofoten ") {
            weatherIcon.push("heavyrain")
          }
          else if (locationKeys[i] === "Hallingdalselva"){
            weatherIcon.push("heavyrain")
          }
          break;
        case "fog":
          if(locationKeys[i] === "Tana") {
            weatherIcon.push("fog")
          }
          else if(locationKeys[i] === "Lofoten ") {
            weatherIcon.push("fog")
          }
          else if (locationKeys[i] === "Hallingdalselva"){
            weatherIcon.push("fog")
          }
          break;
        default:
          weatherIcon.push("Missing weather data switch")
        }
       // För denna kommer endast kör 3 gånger för den exakta tiden finns bara 1 i arrayn och då på dessa 3 location och dessa element har jag redan i arrayn-locationElements
      locationElements[i].innerHTML = `<h3>${weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Details"].air_temperature} c°</h3>
        <img src=img/${weatherIcon[i]}.png alt="Weather Icon" height="50px" width="50px">
        `
      break;
      }
    }
  }
}
/*
  Denna funktion, hämtar all väderData på ett interval exempelvis varje 5 sekunder hämta api datat. Sorterar väder-datat. Funktionen "CheckDateTime" den kollar vilken den lokala tiden är alltså vad är klockan nu? jämförelse vad det är för tid på datat vi får på vädret. Om klockan är 12:34 och i vårat objekt har vi tiden 12:00 och vädret för denna tidslag. Så kommer detta objekt att sättas och displays "realtid" för varje timme, vad det är för väder just för denna timme.
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

// Display admin-uploads to home-page
axios.get('http://localhost:3000/adminUpload').then(result => {
  fishDescriptionElement.innerHTML += `
    ${result.data[0].name} är en av våra många glada besökare,
    här har fångats ${result.data[0].fishType}, med en vikt på hela ${result.data[0].fishWeight}
  `
  adminImageElement.setAttribute('src', `${result.data[0].image}`)
  userDescriptionElement.innerHTML += `"${result.data[0].textDescription}"`
})
