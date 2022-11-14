const fetchedData = document.querySelector("#fetchedData");
const fishingHeader = document.querySelector("#fishing-header");
const fishingWeatherDisplay = document.querySelector("#weather-display");

// 1. Få all data från formuläret på index.html
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

let destinationInput = urlParams.get("destination");
let startpointInput = urlParams.get("startpoint");
let vehicleInput = urlParams.get("vehicle");

let guideInput = urlParams.get("guide");
let equipementInput = urlParams.get("equipement");

let nightValue = Number(urlParams.get("night"));

let guideValue = 0;
let equipementValue = 0;

if (guideInput !== "no-guide") {
  guideValue = 500;
}

if (equipementInput !== "no-equipement") {
  equipementValue = 2000;
}

// länka locationElements till header
// för att hämta väderdata
locationElements = [];
let locationTana = document.querySelector("#locationTana");
let locationLofoten = document.querySelector("#locationLofoten");
let locationHallingdalselva = document.querySelector(
  "#locationHallingdalselva"
);

locationElements.push(locationTana);
locationElements.push(locationLofoten);
locationElements.push(locationHallingdalselva);

document.querySelector("#locationTana").style.display = "none";
document.querySelector("#locationLofoten").style.display = "none";
document.querySelector("#locationHallingdalselva").style.display = "none";

// funktion som läser av url parametern, destinationInput, och hämtar
// datan från rätt fiskeby från fiskeplatser.json.

fetch("fiskeplatser.json")
  .then((response) => response.json())
  .then((data) => {
    // skapa loop, med värde för för att loopa igenom
    // och när if blir sant, visa svaret

    for (let i = 0; i < data.length; i++) {
      if (destinationInput === data[i].name) {
        fishingHeader.textContent = data[i].name;

        fetchedData.innerHTML += `
        <h3>${data[i].name}</h3>
        <p>${data[i].infoWiki1}</p>
        <p>${data[i].infoWiki2}</p>
        `;
        break;
      } else if (destinationInput !== data[i].name && i === data.length - 1) {
        fetchedData.innerHTML += `
        <h3>Error</h3>
        <p>Saknas resemål. Gå tillbaks till huvudsidan
        <a href="index.html">Fiska i Norge</a> </p>
        `;
        break;
      }
    }
  });

const cabin = 1299;
const totalCostArray = [];
const startDestination = 0;
const tanaDistance = 1596;
const lofotenDistance = 1346;
const hallingdalselvaDistance = 674;

// average vehicle gas consumption
const standardGasPrice = 20;
const averageVehicleLiter100Km = 8; // + "liter per 100km";
const motorcycleVehicleLiter100Km = 4; // + "liter per 100km";
const suvVehicleLiter100Km = 10; // "liter per 100km";

//guideValue = 500; // natt
//equipementValue = 2000; //fast pris
/* function that runs if guideInput !== no guide then the guideValue multiplies by the nightValue */
const guideCost = (guide, nights) => {
  return totalCostArray.push(guide * nights);
};

/* function that multiplies the choice of living tent, cabin or hotel with the amount of nights the user has chosen in the form */
const livingCost = (living, nights) => {
  return totalCostArray.push(living * nights);
};

/* function based on which vehicle and destination has been chosen in the form calculates the l/km price multiplies it with the distance and then multiplies it with the gas price. */
const travelCostVehicle = (vehicle, distance, currgasprice) => {
  totalCostArray.push((vehicle / 100) * distance * currgasprice * 2); // ger vehicle liter per km * distans till location * nuvarande gas price
};

/* function checking which location value destinationInput dropdown from the form has and returns the relevant distance. */
//const destinationArray = [];
const destinationChoice = () => {
  if (destinationInput === "Tana") {
    return tanaDistance;
  } else if (destinationInput === "Lofoten") {
    return lofotenDistance;
  } else return hallingdalselvaDistance;
};

/* function that checks which vehicle has been chosen in the radiobutton on the form and returns the relevant liter per 100km data. */
const vehicleChoice = () => {
  if (vehicleInput === "motorcycle") {
    return motorcycleVehicleLiter100Km;
  } else if (vehicleInput === "car") {
    return averageVehicleLiter100Km;
  } else {
    return suvVehicleLiter100Km;
  }
};

/* accumulator (sum) initial value is 0, index[0] is added to accumulator (sum) so accumulator value will now be same as index [0]
 then index[1] ... and so on */
const totalCost = totalCostArray.reduce((accumulator, currVal) => {
  return accumulator + currVal;
}, 0);

livingCost(cabin, nightValue);
travelCostVehicle(vehicleChoice(), destinationChoice(), standardGasPrice);

totalCostArray.push(equipementValue);
guideCost(guideValue, nightValue);
/* sum variable that sums up the value in the totalCostArray to one to also show total in chart.js pushing the summarized value into the totalCostArray */
let sum = totalCostArray.reduce(
  (previndex, currindex) => previndex + currindex,
  0
);
totalCostArray.push(sum);

// 2. Funktioner för att visa graf med Chart.js
const chartHeader = document.querySelector("#chart-header");

// bensin förbrukning beroende på bil
const travelCostChart = document.querySelector("#myChartContainer");

// chart.js graf
const ctx = document.querySelector("#myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Stuga", "Bensin", "Utrustning", "Guide", "Totalt"],
    datasets: [
      {
        label: "Kostnader",
        fill: true,
        data: totalCostArray,
        backgroundColor: [
          "rgba(245, 40, 145, 0.37)",
          "rgba(47, 40, 145, 0.37)",
          "rgba(47, 162, 145, 0.37)",
          "rgba(109, 166, 100, 0.31)",
          "rgba(196, 220, 255, 0.31)",
        ],
        borderColor: ["rgba(180, 191, 96, 1)"],
        borderWidth: 3,
      },
    ],
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

// 3. Hämta väderdata funktioner
// Header för att identifiera oss mot weather api, yr.no
let headers = new Headers({
  "User-Agent": "jhellberg.com johan@jhellberg.com",
});

async function GetAllWeatherData() {
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
      Lofoten: await (
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
  // Gör att denna array bara består av nyckeln-värdet av locationen alltså locationKeyInput-arrayn
  let locationKeyInput = []; // Här har jag alla keys som jag behöver

  // Denna kollar om många områden som finns som vi hämtar
  for (let i = 0; i < result.length; i++) {
    if (result[i].hasOwnProperty(result[i]) !== undefined) {
      locationKeyInput.push(Object.keys(result[i]));
    }
  }

  // Object.keys-funktion will return a array and locationKey is a array too
  // locationKeyInput är redan en array och Object.keys returnar också en array därför i detta fall använder jag mig av funktionen-flat som gör dessa till värden istället för arrays
  let locationKey = locationKeyInput.flat();
  localStorage.setItem("locationKey", JSON.stringify(locationKey));

  // Pushar in objekt till arrayn weatherData, så många som det finns location
  let weatherData = [];
  for (let i = 0; i < result.length; i++) {
    weatherData.push({
      [locationKey[i]]: { data: [], updatedWeatherReport: {} },
    });
  }
  // Genom denna loop får vi det uppdaterade-väder-raporten för just det specifika location
  for (let i = 0; i < result.length; i++) {
    let updatedDate = result[i][
      locationKey[i]
    ].properties.meta.updated_at.slice(0, 10);
    // console.log(updatedDate);
    let currenTimeIndex =
      result[i][locationKey[i]].properties.meta.updated_at.indexOf(":");
    // console.log(currenTimeIndex);

    updatedTimeFinal = result[i][
      locationKey[i]
    ].properties.meta.updated_at.slice(
      currenTimeIndex - 2,
      currenTimeIndex + 3
    );

    weatherData[i][locationKey[i]].updatedWeatherReport.time = updatedTimeFinal;
    weatherData[i][locationKey[i]].updatedWeatherReport.date = updatedDate;
  }

  for (let i = 0; i < result.length; i++) {
    for (
      let j = 0;
      j < result[i][locationKey[i]].properties.timeseries.length;
      j++
    ) {
      if (
        result[i][locationKey[i]].properties.timeseries[j].data
          ?.next_1_hours !== undefined
      ) {
        let weatherSymbol =
          result[i][locationKey[i]].properties.timeseries[j].data.next_1_hours
            .summary.symbol_code;

        //IndexTim
        let timeIndex =
          result[i][locationKey[i]].properties.timeseries[j].time.indexOf("T");
        //TIME
        let time =
          result[i][locationKey[i]].properties.timeseries[j].time.lastIndexOf(
            ":"
          );
        // TIME FInal
        let timeFinal = result[i][locationKey[i]].properties.timeseries[
          j
        ].time.slice(timeIndex + 1, time);

        let dateFinal = result[i][locationKey[i]].properties.timeseries[
          j
        ].time.slice(0, 10);

        let weatherDetail =
          result[i][locationKey[i]].properties.timeseries[j].data.instant
            .details;

        weatherData[i][locationKey[i]].data.push({
          "Weather-Details": weatherDetail,
          "Weather-Symbol": weatherSymbol,
          date: dateFinal,
          time: timeFinal,
        });
      }
    }
  }
  localStorage.setItem("weatherDataFinal", JSON.stringify(weatherData));
  // SLUT PÅ FUNKTIONEN
}

function CheckDateTime() {
  let dateToday = new Date().toLocaleDateString("sv-SE");
  var timeToday = new Date().toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  }); // Fixa så att dessa med datum och tid och nu tvingat att göra det till Svenskt!

  let weatherDataFinal = JSON.parse(localStorage.getItem("weatherDataFinal"));
  let locationKeys = JSON.parse(localStorage.getItem("locationKey"));

  // 3 deklarerade väder-iconer
  let weatherIcon = [];

  // Här så splitar jag varje tid på weatherData-arrayn och jämför om det är rätt datum och tid
  for (let i = 0; i < weatherDataFinal.length; i++) {
    for (let j = 0; j < weatherDataFinal[i][locationKeys[i]].data.length; j++) {
      let ArrayindexTime =
        weatherDataFinal[i][locationKeys[i]].data[j].time.indexOf(":");
      let ArraytimeNow = weatherDataFinal[i][locationKeys[i]].data[
        j
      ].time.slice(0, ArrayindexTime);

      let currentTimeIndex = timeToday.indexOf(":");
      let currentTime = timeToday.slice(0, currentTimeIndex);

      if (
        ArraytimeNow === currentTime &&
        weatherDataFinal[i][locationKeys[i]].data[j].date === dateToday
      ) {
        // weatherIcon.push(weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Symbol"])
        // locationElements[i].innerHTML = `<h4>${locationKeys[i]},<br> ${weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Details"].air_temperature} c°</h4>
        // <img src=img/${weatherIcon[i]}.png alt="Weather Icon" height="50px" width="50px">
        // `
        if (destinationInput === locationKeys[i]) {
          weatherIcon.push(
            weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Symbol"]
          );

          fishingWeatherDisplay.innerHTML = `<h4>${locationKeys[i]},<br> ${
            weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Details"]
              .air_temperature
          } c°</h4>
        <img src=img/${
          weatherIcon[0]
        }.png alt="Weather Icon" height="50px" width="50px">`;
          break;
        }
        break;
      }
    }
  }
}

/*
  Denna funktion, hämtar all väderData på ett interval exempelvis varje 5 sekunder hämta api datat. Sorterar väder-datat. Funktionen "checkDateTime" den kollar vilken den lokala tiden är alltså vad är klockan nu? jämförelse vad det är för tid på datat vi får på vädret. Om klockan är 12:34 och i vårat objekt har vi tiden 12:00 och vädret för denna tidslag. Så kommer detta objekt att sättas och displays "realtid" för varje timme, vad det är för väder just för denna timme.
*/
function IntervalLoop() {
  setInterval(() => {
    GetAllWeatherData();
    CheckDateTime();
  }, 900000); //  900000 milisecounds, 15min interval update
}
GetAllWeatherData(); // Hämtar all väder-data och sorterar allting
CheckDateTime(); // Kollar vilket specifikt väder-objekt vi ska ta
IntervalLoop(); // This function is asyncroumus
