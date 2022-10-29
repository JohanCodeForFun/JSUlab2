// Function för att hämta väder data
async function GetWeatherData() {
  let response = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.5&lon=11.0')

  let result = await response.json();
  let arrayResult = [];

  // Loopar igenom arrayn för att lägga till object till arrayn-variabeln "arrayResult".
  for(let i = 0; i < result.properties.timeseries.length; i++) {
    arrayResult.push(result.properties.timeseries[i])
  }
  localStorage.setItem('weatherData', JSON.stringify(arrayResult))
}

// Function, denna sorterar datat så vi bara plockar ut det viktigaste datat vi behöver
function SortWeatherData() {
  // Här får vi allt väderdata till en array "weatherData"
  let weatherInput = JSON.parse(localStorage.getItem('weatherData'))

  // Här får jag båda tiden och datum
  let Date_time_Array = []
  for(let i = 0; i < weatherInput.length; i++) {
    Date_time_Array.push(weatherInput[i].time)
  }

  // Loopen här nere så slicar jag tiden, datum och datat om väder till en array
  let weatherData = []
  for(let i = 0; i < weatherInput.length; i++) {
    let date = Date_time_Array[i].slice(0,10)

    let indexTime = Date_time_Array[i].indexOf('T')
    let indexTimeAgain = Date_time_Array[i].lastIndexOf(':')

    let timeNow = Date_time_Array[i].slice((indexTime + 1), indexTimeAgain)
    weatherData.push({"Weather-Details": weatherInput[i].data.instant.details, "date": date, "time": timeNow})
  }
  return weatherData
}

function CheckDate() {
  let dateToday = new Date().toLocaleDateString()
  let timeToday = new Date().toLocaleTimeString()

  // INTE ARRAY BARA LOKAL TIDEN
  console.log("Timetoday " + timeToday)
  let currentTimeIndex = timeToday.indexOf(':')
  let currentTime = timeToday.slice(0, currentTimeIndex)
  console.log("currentTime " + currentTime)

  // Här loopar igenom för att jämnföra den lokala tiden och tiden på arrayn
  for(let i = 0; i < weatherData.length; i++) {
    let ArrayindexTime = weatherData[i].time.indexOf(':')
    let ArraytimeNow = weatherData[i].time.slice(0, ArrayindexTime)

    let currentTimeIndex = timeToday.indexOf(':')
    let currentTime = timeToday.slice(0, currentTimeIndex)

    // Här kollar vi tiden på arrayn och den lokala tiden och datum. Om detta är sant så då vet vi vilken array-index vi ska köra!
    if(ArraytimeNow === currentTime && weatherData[i].date === dateToday) {
      // Kör denna det är rätt på den lokala tiden! returna denna!
      console.log(weatherData[i])

      console.log('currentTime: ' + currentTime)
      console.log('ArraytimeNow ' + ArraytimeNow)
    }
  }
}

// MAIN
GetWeatherData()
let weatherData = SortWeatherData()
CheckDate()

// console.log(weatherData)
