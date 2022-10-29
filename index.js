// Här får vi allt väderdata till en array "weatherData"
let weatherData = JSON.parse(localStorage.getItem('weatherData'))
console.log(weatherData)

GetWeatherData()

// Function för att hämta väder data
async function GetWeatherData() {
  let response = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.5&lon=11.0')

  let result = await response.json();

  let arrayResult = [];

  // Loopar igenom arrayn för att lägga till object till arrayn-variabeln "arrayResult".
  for(let i = 0; i < result.properties.timeseries.length; i++) {
    arrayResult.push(result.properties.timeseries[i].data.instant.details)
  }
  localStorage.setItem('weatherData', JSON.stringify(arrayResult))
}
