// 3. Hämta väderdata funktioner
// Header för att identifiera oss mot weather api, yr.no
let headers = new Headers({
    "User-Agent": "jhellberg.com johan@jhellberg.com",
  });
  
  export async function GetAllWeatherData() {
    let result = await Promise.all([
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
    }
  
  
  
    // Object.keys-funktion will return a array and locationKey is a array too
    // locationKeyInput är redan en array och Object.keys returnar också en array därför i detta fall använder jag mig av funktionen-flat som gör dessa till värden istället för arrays
    let locationKey = locationKeyInput.flat()
    localStorage.setItem('locationKey', JSON.stringify(locationKey))
  
    // Pushar in objekt till arrayn weatherData, så många som det finns location
    let weatherData = [];
    for(let i = 0; i < result.length; i++) {
      weatherData.push({[locationKey[i]]: {data: [], updatedWeatherReport: {}}})
    }
    // Genom denna loop får vi det uppdaterade-väder-raporten för just det specifika location
    for(let i = 0; i < result.length; i++) {
      let updatedDate = result[i][locationKey[i]].properties.meta.updated_at.slice(0,10)
      // console.log(updatedDate);
      let currenTimeIndex = result[i][locationKey[i]].properties.meta.updated_at.indexOf(':')
      // console.log(currenTimeIndex);
  
      let updatedTimeFinal = result[i][locationKey[i]].properties.meta.updated_at.slice(currenTimeIndex - 2, currenTimeIndex + 3)
  
      weatherData[i][locationKey[i]].updatedWeatherReport.time = updatedTimeFinal;
      weatherData[i][locationKey[i]].updatedWeatherReport.date = updatedDate;
    }
  
    for(let i = 0; i < result.length; i++) {
      for(let j = 0; j < result[i][locationKey[i]].properties.timeseries.length; j++) {
        if(result[i][locationKey[i]].properties.timeseries[j].data?.next_1_hours !== undefined) {
          let weatherSymbol = result[i][locationKey[i]].properties.timeseries[j].data.next_1_hours.summary.symbol_code
  
          //IndexTim
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
  
  export function CheckDateTime() {
    let dateToday = new Date().toLocaleDateString('sv-SE');
    var timeToday = new Date().toLocaleTimeString('sv-SE', {hour: '2-digit', minute:'2-digit'}); // Fixa så att dessa med datum och tid och nu tvingat att göra det till Svenskt!
  
  
    let weatherDataFinal = JSON.parse(localStorage.getItem('weatherDataFinal'))
    let locationKeys = JSON.parse(localStorage.getItem('locationKey'))
  
    // 3 deklarerade väder-iconer
    let weatherIcon = [];
  
  
    // Här så splitar jag varje tid på weatherData-arrayn och jämför om det är rätt datum och tid
    for(let i = 0; i < weatherDataFinal.length; i++) {
      for(let j = 0; j < weatherDataFinal[i][locationKeys[i]].data.length; j++) {
        let ArrayindexTime = weatherDataFinal[i][locationKeys[i]].data[j].time.indexOf(":");
        let ArraytimeNow = weatherDataFinal[i][locationKeys[i]].data[j].time.slice(0, ArrayindexTime);
  
        let currentTimeIndex = timeToday.indexOf(":");
        let currentTime = timeToday.slice(0, currentTimeIndex);
  
        console.log(dateToday);
        if (ArraytimeNow === currentTime && weatherDataFinal[i][locationKeys[i]].data[j].date === dateToday) {
          switch(weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Symbol"]) {
            case "partlycloudy_night":
              if(locationKeys[i] === "Tana") {
                weatherIcon.push("partlycloudy_night")
              }
              else if(locationKeys[i] === "Lofoten") {
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
              else if(locationKeys[i] === "Lofoten") {
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
              else if(locationKeys[i] === "Lofoten") {
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
              else if(locationKeys[i] === "Lofoten") {
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
              else if(locationKeys[i] === "Lofoten") {
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
              else if(locationKeys[i] === "Lofoten") {
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
              else if(locationKeys[i] === "Lofoten") {
                weatherIcon.push("fog")
              }
              else if (locationKeys[i] === "Hallingdalselva"){
                weatherIcon.push("fog")
              }
              break;
            default:
              weatherIcon.push("Missing weather data switch")
  
          }
          console.log(weatherIcon);
           // För denna kommer endast kör 3 gånger för den exakta tiden finns bara 1 i arrayn och då på dessa 3 location och dessa element har jag redan i arrayn-locationElements
          locationElements[i].innerHTML = `<h3>${weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Details"].air_temperature} c°</h3>
            <img src=img/${weatherIcon[i]}.png alt="Weather Icon" height="50px" width="50px">
            `
          break;
        }
      }
    }
    console.log('test')
  }