// Description
// 1. Hämta element att jobba med
// 2. Hämta väderdata funktioner
// 3. Visa väderdata
// 3.
// 4.
// 5.

console.log("index.html")
// 1. Hämta element att jobba med
const weatherDataSection = document.querySelector("#weatherDataSection");
const locationTana = document.querySelector("#locationTana");
const locationLofoten = document.querySelector("#locationLofoten");
const locationHallingdalselva = document.querySelector(
  "#locationHallingdalselva"
);
const imageIconElement = document.querySelector("#weatherImage");

// 2. Hämta väderdata funktioner
// Header för att identifiera oss mot weather api, yr.no
let headers = new Headers({
  "User-Agent": "jhellberg.com johan@jhellberg.com",
});

// Function för att hämta väderdata
async function GetWeatherData() {
  result = await Promise.all([
    {
      Tana: await (
        await fetch(
          "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.43112&lon=6.24668",
          {
            method: "GET",
            headers: headers,
          }
        )
      ).json(),
    },
    {
      "Lofoten ": await (
        await fetch(
          "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=68.04534&lon=13.38235",
          {
            method: "GET",
            headers: headers,
          }
        )
      ).json(),
    },
    {
      Hallingdalselva: await (
        await fetch(
          "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.42843&lon=9.38549",
          {
            method: "GET",
            headers: headers,
          }
        )
      ).json(),
    },
  ]);

  let weatherData = {"tana": [],
                    "lofoten" : [],
                    "hallingdalselva": []}

  let tanaArrayData = [];
  let LofotenArrayData = [];
  let HallingdalselvaArrayData = [];

  for (let i = 0; i < result[0].Tana.properties.timeseries.length; i++) {
    tanaArrayData.push(result[0].Tana.properties.timeseries[i]);
  }

  for (let i = 0; i < result[1]["Lofoten "].properties.timeseries.length; i++) {
    LofotenArrayData.push(result[1]["Lofoten "].properties.timeseries[i]);
  }

  for (
    let i = 0;
    i < result[2].Hallingdalselva.properties.timeseries.length;
    i++
  ) {
    HallingdalselvaArrayData.push(
      result[2].Hallingdalselva.properties.timeseries[i]
    );
  }

  localStorage.setItem("tanaArrayData", JSON.stringify(tanaArrayData));
  localStorage.setItem("LofotenArrayData", JSON.stringify(LofotenArrayData));
  localStorage.setItem(
    "HallingdalselvaArrayData",
    JSON.stringify(HallingdalselvaArrayData)
  );

  let UpdatedDate = result[0].Tana.properties.meta.updated_at.slice(0, 10);
  let currentTimeIndex = result[0].Tana.properties.meta.updated_at.indexOf(":");

  let TanaUpdatedTime = result[0].Tana.properties.meta.updated_at.slice(
    currentTimeIndex - 2,
    currentTimeIndex + 3
  );

  localStorage.setItem(
    "tana-updated-weater-report",
    JSON.stringify({ time: TanaUpdatedTime, date: UpdatedDate })
  );

  let UpdatedDate2 = result[1]["Lofoten "].properties.meta.updated_at.slice(
    0,
    10
  );
  let currentTimeIndex2 = result[1][
    "Lofoten "
  ].properties.meta.updated_at.indexOf(":");

  let LofotenUpdatedTime = result[1][
    "Lofoten "
  ].properties.meta.updated_at.slice(
    currentTimeIndex2 - 2,
    currentTimeIndex2 + 3
  );

  localStorage.setItem(
    "lofoten-updated-weater-report",
    JSON.stringify({ time: LofotenUpdatedTime, date: UpdatedDate2 })
  );

  let UpdatedDate3 = result[2].Hallingdalselva.properties.meta.updated_at.slice(
    0,
    10
  );
  let currentTimeIndex3 = result[2].Hallingdalselva.properties.meta.updated_at.indexOf(
    ":"
  );

  let HallingdalselvaUpdatedTime = result[2].Hallingdalselva.properties.meta.updated_at.slice(
    currentTimeIndex3 - 2,
    currentTimeIndex3 + 3
  );

  localStorage.setItem(
    "hallingdalselva-updated-weater-report",
    JSON.stringify({ time: HallingdalselvaUpdatedTime, date: UpdatedDate3 })
  );

  let tanaWeatherSymbol = [];
  let lofotenWeatherSymbol = [];
  let hallingdalselvaWeatherSymbol = [];

  for (let i = 0; i < result[0].Tana.properties.timeseries.length; i++) {
    if (
      result[0].Tana.properties.timeseries[i].data?.next_1_hours !== undefined
    ) {
      tanaWeatherSymbol.push(
        result[0].Tana.properties.timeseries[i].data.next_1_hours.summary
          .symbol_code
      );
    }
  }

  for (let i = 0; i < result[1]["Lofoten "].properties.timeseries.length; i++) {
    if (
      result[1]["Lofoten "].properties.timeseries[i].data?.next_1_hours !==
      undefined
    ) {
      lofotenWeatherSymbol.push(
        result[1]["Lofoten "].properties.timeseries[i].data.next_1_hours.summary
          .symbol_code
      );
    }
  }

  for (
    let i = 0;
    i < result[2].Hallingdalselva.properties.timeseries.length;
    i++
  ) {
    if (
      result[2].Hallingdalselva.properties.timeseries[i].data?.next_1_hours !==
      undefined
    ) {
      hallingdalselvaWeatherSymbol.push(
        result[2].Hallingdalselva.properties.timeseries[i].data.next_1_hours
          .summary.symbol_code
      );
    }
  }

  localStorage.setItem("tanaWeatherSymbol", JSON.stringify(tanaWeatherSymbol));
  localStorage.setItem(
    "lofotenWeatherSymbol",
    JSON.stringify(lofotenWeatherSymbol)
  );
  localStorage.setItem(
    "hallingdalselvaWeatherSymbol",
    JSON.stringify(hallingdalselvaWeatherSymbol)
  );
}

// Function, denna sorterar datat så vi bara plockar ut det viktigaste datat vi behöver
function SortWeatherData() {

  let tanaWeatherSymbol =  JSON.parse(localStorage.getItem('tanaWeatherSymbol'))
  let lofotenWeatherSymbol = JSON.parse(localStorage.getItem('lofotenWeatherSymbol'))
  let hallingdalselvaWeatherSymbol = JSON.parse(localStorage.getItem('hallingdalselvaWeatherSymbol'))

  let tanaArrayData =  JSON.parse(localStorage.getItem('tanaArrayData'))
  let lofotenArrayData = JSON.parse(localStorage.getItem('LofotenArrayData'))
  let hallingdalselvaArrayData = JSON.parse(localStorage.getItem('HallingdalselvaArrayData'))

  let tana_Date_time_Array = [];
  let lofoten_Date_time_Array = [];
  let hallingdalselva_Date_time_Array = [];

  for (let i = 0; i < tanaWeatherSymbol.length; i++) {
    tana_Date_time_Array.push(tanaArrayData[i].time);
  }

  for (let i = 0; i < lofotenWeatherSymbol.length; i++) {
    lofoten_Date_time_Array.push(lofotenArrayData[i].time);
  }

  for (let i = 0; i < hallingdalselvaWeatherSymbol.length; i++) {
    hallingdalselva_Date_time_Array.push(hallingdalselvaArrayData[i].time);
  }

  // Här får vi allt väderdata till en array "weatherData", samt för väder-symbol
  let tanaWeatherData = [];
  let lofotenWeatherData = [];
  let hallingdalselvaWeatherData = [];

  for (let i = 0; i < hallingdalselvaWeatherSymbol.length; i++) {
    let hallingdalselvaDate = hallingdalselva_Date_time_Array[i].slice(0, 10);
    let hallingdalselvaIndexTime = hallingdalselva_Date_time_Array[i].indexOf(
      "T"
    );
    let hallingdalselvaTimeAgain = hallingdalselva_Date_time_Array[
      i
    ].lastIndexOf(":");

    let hallingdalselvaTimeNow = hallingdalselva_Date_time_Array[i].slice(
      hallingdalselvaIndexTime + 1,
      hallingdalselvaTimeAgain
    );

    let hallingdalselvaWeatherSymbol = JSON.parse(
      localStorage.getItem("hallingdalselvaWeatherSymbol")
    );

    let hallingdalselvaArrayData = JSON.parse(
      localStorage.getItem("HallingdalselvaArrayData")
    );

    hallingdalselvaWeatherData.push({
      "Weather-Details": hallingdalselvaArrayData[i].data.instant.details,
      "Weather-Symbol": hallingdalselvaWeatherSymbol[i],
      date: hallingdalselvaDate,
      time: hallingdalselvaTimeNow,
    });
  }

  for (let i = 0; i < lofotenWeatherSymbol.length; i++) {
    let lofotenDate = lofoten_Date_time_Array[i].slice(0, 10);
    let lofotenIndexTime = lofoten_Date_time_Array[i].indexOf("T");
    let lofotenTimeAgain = lofoten_Date_time_Array[i].lastIndexOf(":");

    let lofotenTimeNow = lofoten_Date_time_Array[i].slice(
      lofotenIndexTime + 1,
      lofotenTimeAgain
    );

    let lofotenWeatherSymbol = JSON.parse(
      localStorage.getItem("lofotenWeatherSymbol")
    );
    let lofotenArrayData = JSON.parse(localStorage.getItem("LofotenArrayData"));

    lofotenWeatherData.push({
      "Weather-Details": lofotenArrayData[i].data.instant.details,
      "Weather-Symbol": lofotenWeatherSymbol[i],
      date: lofotenDate,
      time: lofotenTimeNow,
    });
  }

  for (let i = 0; i < tanaWeatherSymbol.length; i++) {
    let tanaDate = tana_Date_time_Array[i].slice(0, 10);

    let tanaIndexTime = tana_Date_time_Array[i].indexOf("T");
    let tanaTimeAgain = tana_Date_time_Array[i].lastIndexOf(":");
    let tanaTimeNow = tana_Date_time_Array[i].slice(
      tanaIndexTime + 1,
      tanaTimeAgain
    );

    tanaWeatherData.push({
      "Weather-Details": tanaArrayData[i].data.instant.details,
      "Weather-Symbol": tanaWeatherSymbol[i],
      date: tanaDate,
      time: tanaTimeNow,
    });
  }

  localStorage.setItem(
    "sortedTanaWeatherData",
    JSON.stringify(tanaWeatherData)
  );
  localStorage.setItem(
    "sortedLofotenWeatherData",
    JSON.stringify(lofotenWeatherData)
  );
  localStorage.setItem(
    "sortedHallingdalselvaWeatherData",
    JSON.stringify(hallingdalselvaWeatherData)
  );
}

// Function Jämnför den lokala tiden med tiden med väder-arrayn
function CheckDateTime() {
  let dateToday = new Date().toLocaleDateString();
  let timeToday = new Date().toLocaleTimeString();

  let sortedTanaWeatherData = JSON.parse(
    localStorage.getItem("sortedTanaWeatherData")
  );
  let sortedLofotenWeatherData = JSON.parse(
    localStorage.getItem("sortedLofotenWeatherData")
  );
  let sortedHallingdalselvaWeatherData = JSON.parse(
    localStorage.getItem("sortedHallingdalselvaWeatherData")
  );

  console.log(sortedHallingdalselvaWeatherData)

  // 3 deklarerade väder-iconer
  let tanaWeatherIcon;
  let lofotenWeatherIcon;
  let hallingdalselvaIcon;

  /*
    Här så får vi se om det skiljer sig mellan 3 områdenas timmar på arrayn annars går det bra att köra på en length här bara. För alla kommer då vara samma
  */
  for (let i = 0; i < sortedTanaWeatherData.length; i++) {
    let ArrayindexTime = sortedTanaWeatherData[i].time.indexOf(":");
    let ArraytimeNow = sortedTanaWeatherData[i].time.slice(0, ArrayindexTime);

    let currentTimeIndex = timeToday.indexOf(":");
    let currentTime = timeToday.slice(0, currentTimeIndex);

    // Här kollar vi tiden på arrayn och den lokala tiden och datum. Om detta är sant så då vet vi vilken array-index vi ska köra!
    if (
      ArraytimeNow === currentTime &&
      sortedTanaWeatherData[i].date === dateToday
    ) {
      // Denna är i realtid, vi får ut vädret just för denna timme!

      let tanaAirTemp = sortedTanaWeatherData[i]["Weather-Details"].air_temperature
      let tanaWeatherSymbol = sortedTanaWeatherData[i]["Weather-Symbol"]

      let lofotenAirTemp = sortedLofotenWeatherData[i]["Weather-Details"].air_temperature
      let lofotenWeatherSymbol = sortedLofotenWeatherData[i]["Weather-Symbol"]

      let hallingdalselvaAirTemp = sortedHallingdalselvaWeatherData[i]["Weather-Details"].air_temperature

      let hallingdalselvaWeatherSymbol = sortedHallingdalselvaWeatherData[i]["Weather-Symbol"]

      localStorage.setItem('hallingdalselvaAirTemp', hallingdalselvaAirTemp)
      localStorage.setItem('lofotenAirTemp', lofotenAirTemp)
      localStorage.setItem('tanaAirTemp', tanaAirTemp)

      switch (hallingdalselvaWeatherSymbol) {
        case "partlycloudy_night":
          hallingdalselvaIcon = "partlycloudy_night";
          break;
        case "fair_night":
          hallingdalselvaIcon = "fair_night";
          break;
        case "partlycloudy_day":
          hallingdalselvaIcon = "partlycloudy_day";
          break;
        case "cloudy":
          hallingdalselvaIcon = "cloudy";
          break;
        case "lightrain":
          hallingdalselvaIcon = "lightrain";
          break;
        case "heavyrain":
          hallingdalselvaIcon = "heavyrain";
          break;
        case "fog":
          hallingdalselvaIcon = "fog";
          break;
        default:
          hallingdalselvaIcon = "Missing weather data switch";
      }
      switch (lofotenWeatherSymbol) {
        case "partlycloudy_night":
          lofotenWeatherIcon = "partlycloudy_night";
          break;
        case "fair_night":
          lofotenWeatherIcon = "fair_night";
          break;
        case "partlycloudy_day":
          lofotenWeatherIcon = "partlycloudy_day";
          break;
        case "cloudy":
          lofotenWeatherIcon = "cloudy";
          break;
        case "lightrain":
          lofotenWeatherIcon = "lightrain";
          break;
        case "heavyrain":
          lofotenWeatherIcon = "heavyrain";
          break;
        case "fog":
          lofotenWeatherIcon = "fog";
          break;
        default:
          lofotenWeatherIcon = "Missing weather data switch";
      }

      switch (tanaWeatherSymbol) {
        case "partlycloudy_night":
          tanaWeatherIcon = "partlycloudy_night";
          break;
        case "fair_night":
          tanaWeatherIcon = "fair_night";
          break;
        case "partlycloudy_day":
          tanaWeatherIcon = "partlycloudy_day";
          break;
        case "cloudy":
          tanaWeatherIcon = "cloudy";
          break;
        case "lightrain":
          tanaWeatherIcon = "lightrain";
          break;
        case "heavyrain":
          tanaWeatherIcon = "heavyrain";
          break;
        case "fog":
          tanaWeatherIcon = "fog";
          break;
        default:
          tanaWeatherIcon = "Missing weather data switch";
      }

      console.log('tanaAirTemp: ' + tanaAirTemp)
      console.log('lofotenAirTemp: ' + lofotenAirTemp);
      console.log('hallingdalselvaAirTemp: ' + hallingdalselvaAirTemp);

      console.log('tanaWeatherIcon: ' + tanaWeatherIcon);
      console.log('lofotenWeatherIcon: ' + lofotenWeatherIcon);
      console.log('hallingdalselvaIcon: ' + hallingdalselvaIcon);

      locationTana.innerHTML = `
      <h3>${tanaAirTemp} c°</h3>
      <img src=img/${tanaWeatherIcon}.png alt="Weather Icon" height="50px" width="50px">
      `;

      locationLofoten.innerHTML = `
      <h3>${lofotenAirTemp} c°</h3>
      <img src=img/${lofotenWeatherIcon}.png alt="Weather Icon" height="50px" width="50px">
      `;

      locationHallingdalselva.innerHTML = `
      <h3>${hallingdalselvaAirTemp} c°</h3>
      <img src=img/${hallingdalselvaIcon}.png alt="Weather Icon" height="50px" width="50px">
      `;

      localStorage.setItem('lofotenWeatherIcon', lofotenWeatherIcon)
      localStorage.setItem('tanaWeatherIcon', tanaWeatherIcon)
      localStorage.setItem('hallingdalselvaIcon', hallingdalselvaIcon)
      break;
    }
  }
}

/*
  Denna funktion, hämtar all väderData på ett interval exempelvis varje 5 sekunder hämta api datat. Sorterar väder-datat. Funktionen "CheckDateTime" den kollar vilken den lokala tiden är alltså vad är klockan nu? jämförelse vad det är för tid på datat vi får på vädret. Om klockan är 12:34 och i vårat objekt har vi tiden 12:00 och vädret för denna tidslag. Så kommer detta objekt att sättas och displays "realtid" för varje timme, vad det är för väder just för denna timme.
*/

function IntervalLoop() {
  setInterval(() => {
    GetWeatherData(); // Får all väder-data
    SortWeatherData(); // Sorterar all väder-data
    CheckDateTime(); // Kollar vilket specifikt väder-objekt vi ska ta
  }, 7000); //  900000 milisecounds, 15min interval update
}
// Anropar intervalen med data-inhämtning i detta fall varje 5 sekunder, men denna ska vara kanske var 10 min. Men har kvar detta för att ni kan se att detta funkar också
IntervalLoop();

// append image icon in html, weatherDataSection
locationTana.innerHTML += `
<h3>${weatherAirTemp} c°</h3>
<img src=img/${weatherIcon}.png alt="Weather Icon" height="50px" width="50px">
`;
locationLofoten.innerHTML += `
<h3>${weatherAirTemp} c°</h3>
<img src=img/${weatherIcon}.png alt="Weather Icon" height="50px" width="50px">
`;
locationHallingdalselva.innerHTML += `
<h3>${weatherAirTemp} c°</h3>
<img src=img/${weatherIcon}.png alt="Weather Icon" height="50px" width="50px">
`;

const averageVehicleLiter100Km = 8 + "liter per 100km";
const motorcycleVehicleLiter100Km = 4 + "liter per 100km";
const suvVehicleLiter100Km = 10 + "liter per 100km";

const travelCostAverageVehicle = (distance, currgasprice) => {
  return (averageVehicleLiter100Km / 100) * distance * currgasprice;
};

const travelCostmotorcyleVehicle = (distance, currgasprice) => {
  return (motorcycleVehicleLiter100Km / 100) * distance * currgasprice;
};
const travelCostSuvVehicle = (distance, currgasprice) => {
  return (suvVehicleLiter100Km / 100) * distance * currgasprice;
};
fetch("https://henrikhjelm.se/api/getdata.php?lan=stockholms-lan")
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
  });
