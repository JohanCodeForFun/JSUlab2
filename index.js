// Description 
// 1. Get weather data function
// 2. Display weather data
// 3. 
// 4. 
// 5. 


// Header för att identifiera oss mot weather api, yr.no
let headers = new Headers({
  "User-Agent": "jhellberg.com johan@jhellberg.com"
});

// Function för att hämta väder data
async function GetWeatherData() {
  let response = await fetch(
    "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.5&lon=11.0", {
        method: 'GET',
        headers: headers
});

  let result = await response.json();

  // console.log(result)
  let arrayResult = [];

  // Loopar igenom arrayn för att lägga till object till arrayn-variabeln "arrayResult".
  for (let i = 0; i < result.properties.timeseries.length; i++) {
    arrayResult.push(result.properties.timeseries[i]);
  }

  // Jag sätter en del till local-storage för om vi skulle vilja använda dessa utanför funktionen. Kanske visa vädret 2 dar framåt. Har gjort samma med andra variablar längre ner.
  localStorage.setItem('weatherData', JSON.stringify(arrayResult))

  // Här får jag information om när vädret senaste var uppdaterad och då lägger jag i detta i en localStorage-variabel som i detta fall kommer heta 'Updated'. Jag formaterar strängar från result med slice för att få just datumet, samma princip med tiden.

  let UpdatedDate = result.properties.meta.updated_at.slice(0,10)
  let currentTimeIndex = result.properties.meta.updated_at.indexOf(':')

  let UpdatedTime = result.properties.meta.updated_at.slice(currentTimeIndex - 2, currentTimeIndex + 3)


  localStorage.setItem('updated-weater-report', JSON.stringify({"time": UpdatedTime, "date": UpdatedDate}))


  // Här så loopar jag igenom och får alla väder-symboler som visas för timmar
  let weatherSymbol = [];
  for(let i = 0; i < result.properties.timeseries.length; i++) {
    if(result.properties.timeseries[i].data?.next_1_hours !== undefined) {
      weatherSymbol.push(result.properties.timeseries[i].data.next_1_hours.summary.symbol_code)
    }
  }
  localStorage.setItem('weatherSymbol', JSON.stringify(weatherSymbol))
}

// Function, denna sorterar datat så vi bara plockar ut det viktigaste datat vi behöver
function SortWeatherData() {
  // Här får vi allt väderdata till en array "weatherData", samt för väder-symbol
  let weatherInput = JSON.parse(localStorage.getItem("weatherData"));
  let weatherSymbol = JSON.parse(localStorage.getItem('weatherSymbol'))


  // Här får jag båda tiden och datum
  let Date_time_Array = [];
  for (let i = 0; i < weatherSymbol.length; i++) {
    Date_time_Array.push(weatherInput[i].time);
  }

  // Loopen här nere så slicar jag tiden, datum och datat om väder till en array
  let weatherData = [];
  for (let i = 0; i < weatherSymbol.length; i++) {
    let date = Date_time_Array[i].slice(0, 10);

    let indexTime = Date_time_Array[i].indexOf("T");
    let indexTimeAgain = Date_time_Array[i].lastIndexOf(":");

    let timeNow = Date_time_Array[i].slice(indexTime + 1, indexTimeAgain);
    weatherData.push({
      "Weather-Details": weatherInput[i].data.instant.details,
      "Weather-Symbol": weatherSymbol[i],
      date: date,
      time: timeNow,
    });
  }

  console.log(weatherData)
  localStorage.setItem('sortedWeatherData', JSON.stringify(weatherData))
}

// Function Jämnför den lokala tiden med tiden med väder-arrayn
function CheckDateTime() {
  let dateToday = new Date().toLocaleDateString()
  let timeToday = new Date().toLocaleTimeString()

  let weatherData = JSON.parse(localStorage.getItem('sortedWeatherData'))

  // Här loopar igenom för att jämnföra den lokala tiden och tiden på arrayn
  for (let i = 0; i < weatherData.length; i++) {
    let ArrayindexTime = weatherData[i].time.indexOf(":");
    let ArraytimeNow = weatherData[i].time.slice(0, ArrayindexTime);

    let currentTimeIndex = timeToday.indexOf(":");
    let currentTime = timeToday.slice(0, currentTimeIndex);

    // Här kollar vi tiden på arrayn och den lokala tiden och datum. Om detta är sant så då vet vi vilken array-index vi ska köra!
    if (ArraytimeNow === currentTime && weatherData[i].date === dateToday) {
      // Denna är i realtid, vi får ut vädret just för denna timme!
      console.log(weatherData[i]["Weather-Details"].air_temperature)

      /*
        Här ska vi appenda temperaturen, vindhastighet och all information. Samt så ska vi också välja och byta bild beroende på väder-förhållandet
      */

      break;
    }
  }
}

/*
  Denna funktion, hämtar all väderData på ett interval exempelvis varje 5 sekunder hämta api datat. Sorterar väder-datat. Funktionen "CheckDateTime" den kollar vilken den lokala tiden är alltså vad är klockan nu? jämförelse vad det är för tid på datat vi får på vädret. Om klockan är 12:34 och i vårat objekt har vi tiden 12:00 och vädret för denna tidslag. Så kommer detta objekt att sättas och displays "realtid" för varje timme, vad det är för väder just för denna timme.

*/

function IntervalLoop() {
      setInterval(() => {

      GetWeatherData()      // Får all väder-data
      SortWeatherData()     // Sorterar all väder-data
      CheckDateTime()       // Kollar vilket specifikt väder-objekt vi ska ta
    }, 5000)
 }
 // Anropar intervalen med data-inhämtning i detta fall varje 5 sekunder, men denna ska vara kanske var 10 min. Men har kvar detta för att ni kan se att detta funkar också
 IntervalLoop()


 // GLOBAL-variabler för hantering av väder, OBS: Denna uppdateras inte i "Realtid", för de sätts bara en gång! Medan i IntervalLoop-funktionen så hämtar vi om datat var 10 minuter och då kanske klockan slår 13:00 då kommer weatherData-objekt tiden vara där tiden är just 13:00

//  let weatherData = JSON.parse(localStorage.getItem('sortedWeatherData'))
//  let updatedWeatherReport = JSON.parse(localStorage.getItem('updated-weater-report'))
//  let weatherDataIndex = JSON.parse(localStorage.getItem('weatherDataIndex'))



// 2. Display weather data
const weatherDataSection = document.querySelector('#weatherDataSection');
weatherDataSection.textContent = JSON.parse(localStorage.getItem('sortedWeatherData'))[0]["Weather-Details"].air_temperature;
