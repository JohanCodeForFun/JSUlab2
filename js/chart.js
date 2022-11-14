
const fetchedData = document.querySelector("#fetchedData");
const fishingHeader = document.querySelector("#fishing-header");
const fishingWeatherDisplay = document.querySelector('#weather-display');

locationElements = [];
let locationTana = document.querySelector('#locationTana');
let locationLofoten = document.querySelector('#locationLofoten');
let locationHallingdalselva = document.querySelector('#locationHallingdalselva');

locationElements.push(locationTana)
locationElements.push(locationLofoten)
locationElements.push(locationHallingdalselva)

document.querySelector("#locationTana").style.display = "none";
document.querySelector("#locationLofoten").style.display = "none";
document.querySelector("#locationHallingdalselva").style.display = "none";


// import GetAllWeatherData() 
// import CheckDateTime()

// 1. Få all data från andra sidan
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

let destinationInput = urlParams.get("destination");
let startpointInput = urlParams.get("startpoint");
let vechileInput = urlParams.get("vechile");

let guideInput = urlParams.get("guide");
let equipementInput = urlParams.get("equipement");

let nightValue = Number(urlParams.get("night"));
console.log(nightValue);

let guideValue = 0;
let equipementValue = 0;

if (guideInput !== "no-guide") {
  guideValue = Number(guideInput);
}

if (equipementInput !== "no-equipement") {
  equipementValue = Number(equipementInput);
}

console.log(guideValue);
console.log(equipementValue);
console.log(destinationInput);
console.log(startpointInput);
console.log(vechileInput);







// länka locationElements till header
// för att hämta väderdata

// lägg till funktion (alt lägg in den här koden i chart.js)
// som läser av url parametern, destinationInput, och hämtar
// datan från rätt fiskeby från fiskeplatser.json.

// skapa loop, med värde för för att loopa igenom
// och när if blir sant, visa svaret

// funktion som visar information om fiskeby beroende på
// vilken by dem valt från föregående sida från lokal json fil
let resultFromFetch = [];
fetch("fiskeplatser.json")
  .then((response) => response.json())
  .then(
    (data) => {
      for (let i = 0; i < data.length; i++) {
        console.log(data[i]);

        if (destinationInput === data[i].name) {
          fishingHeader.textContent = data[i].name;

          // locationLofoten
          // let textstring = 'location' + data[i].name;
          // console.log(textstring);

          // textstring.style.display = "block";
          // `location${destinationInput}`.style.display = "inline";
          // location.data.style.display = "inline";

          // locationTana.style.display = "inline";

          fetchedData.innerHTML += `
        <h3>${data[i].name}</h3>
        <p>${data[i].infoWiki1}</p>
        <p>${data[i].infoWiki2}</p>
        `
        break;
        } else if (destinationInput !== data[i].name &&
          i === data.length -1) {
          fetchedData.innerHTML += `
        <h3>Error</h3>
        <p>Saknas resemål. Gå tillbaks till huvudsidan
        <a href="index.html">Fiska i Norge</a> </p>
        `;
        break;
        }
      }
    }
    // spara data objekt i localstorage för att
    // skapa en funktion att fylla i sidan beroende
    // på vilket val användaren har från formuläret
  );

// 2. Funktioner för att visa graf med Chart.js
const chartHeader = document.querySelector("#chart-header");

// funktion, visa bil eller boende graf med radio knappar

// let graphSelect = () => {

// }

// funktion för hur många nätter
nights = 0;
nights = 6;

// ide, lägg till dropdown/buttons för att välja mellan,
// linje, paj, eller doughnot diagram! :)

// distance
const startDestination = 0;
const tanaDistance = 1302;
const lofotenDistance = 1020;
const hallingdalselvaDistance = 555;

// bensin förbrukning beroende på bil
const smallCar = 0.5;
const mediumCar = 0.8;
const largeCar = 1.3;

let gasPrice = 20;
let gasCost = 0;

// boende kostnad
let livingExpensesInput = 0;
let tent = 300;
let cabin = 1300;
let hotell = 2100;

let livingExpenses = 0;
const livingArrayCheap = [];
const livingArrayBudget = [];
const livingArrayLuxury = [];

const calculateLivingCost = (livingExpensesInput, nights) => {
  const calculateLivingCostTent = (accomodation, nights) => {
    for (let i = 0; i < nights; i++) {
      livingArrayCheap.push((livingExpenses += accomodation));
    }
  };

  const calculateLivingCostBudget = (accomodation, nights) => {
    for (let i = 0; i < nights; i++) {
      livingArrayBudget.push((livingExpenses += accomodation));
    }
  };
  const calculateLivingCostLuxury = (accomodation, nights) => {
    for (let i = 0; i < nights; i++) {
      livingArrayLuxury.push((livingExpenses += accomodation));
    }
  };

  calculateLivingCostTent(tent, nights);
  calculateLivingCostBudget(cabin, nights);
  calculateLivingCostLuxury(hotell, nights);
};

calculateLivingCost(livingExpensesInput, nights);

// dagars resande
// det hade varit nice att ha en slider för antal dagar...
// och en funktion som räknar om priset beroende på dagar

// average vechile gas consumption

const averageVehicleLiter100Km = 8; // + "liter per 100km";
const motorcycleVehicleLiter100Km = 4; // + "liter per 100km";
const suvVehicleLiter100Km = 10; // "liter per 100km";

const travelCostAverageVehicle = (distance, currgasprice) => {
  return (averageVehicleLiter100Km / 100) * distance * currgasprice;
};

const travelCostmotorcyleVehicle = (distance, currgasprice) => {
  return (motorcycleVehicleLiter100Km / 100) * distance * currgasprice;
};
const travelCostSuvVehicle = (distance, currgasprice) => {
  return (suvVehicleLiter100Km / 100) * distance * currgasprice;
};

// hur kan jag få dem här lokala i calculateGasCost?
// ThecodingTrain gjorde det snyggt i chart.js youtube videon.
const carArraySmall = [];
const carArrayMedium = [];
const carArrayLarge = [];
// input funktioner för data ovanför...

let calculateGasCost = (carSize, gasPrice, nights) => {
  let calculateGasCostSmall = (carSize, gasPrice, nights) => {
    gasCost = 0;
    gasCost += tanaDistance;
    for (let i = 0; i < nights; i++) {
      carArraySmall.push((gasCost += gasPrice * carSize));
    }
  };
  let calculateGasCostMedium = (carSize, gasPrice, nights) => {
    gasCost = 0;
    gasCost += tanaDistance;
    for (let i = 0; i < nights; i++) {
      carArrayMedium.push((gasCost += gasPrice * carSize));
    }
  };
  let calculateGasCostLarge = (carSize, gasPrice, nights) => {
    gasCost = 0;
    gasCost += tanaDistance;
    for (let i = 0; i < nights; i++) {
      carArrayLarge.push((gasCost += gasPrice * carSize));
    }
    // console.log(carArrayLarge);
  };
  calculateGasCostSmall(smallCar, gasPrice, nights);
  calculateGasCostMedium(mediumCar, gasPrice, nights);
  calculateGasCostLarge(largeCar, gasPrice, nights);
};

calculateGasCost(largeCar, gasPrice, nights);

const travelCostChart = document.querySelector("#myChartContainer");

const ctx = document.querySelector("#myChart").getContext("2d");
const myChart = new Chart(ctx, {
  //types: doughnut, pie, line,
  type: "line",
  data: {
    labels: [
      "nätter 1",
      "nätter 2",
      "nätter 3",
      "nätter 4",
      "nätter 5",
      "nätter 6",
    ],
    datasets: [
      {
        label: "Tält",
        fill: true,
        data: livingArrayCheap,
        // data: [tent, result += tent, result += tent, ],
        backgroundColor: ["rgba(180, 191, 96, 0.2)"],
        borderColor: ["rgba(180, 191, 96, 1)"],
        borderWidth: 3,
      },
      {
        label: "Stuga",
        fill: true,
        data: livingArrayBudget,
        backgroundColor: ["rgba(202, 217, 89, 0.2)"],
        borderColor: ["rgba(202, 217, 89, 1)"],
        borderWidth: 3,
      },
      {
        label: "Hotell",
        fill: true,
        data: livingArrayLuxury,
        backgroundColor: ["rgba(100, 115, 47, 0.2)"],
        borderColor: ["rgba(100, 115, 47, 1)"],
        borderWidth: 3,
      },
      // {
      //   label: "Liten bil",
      //   data: carArraySmall,
      //   backgroundColor: ["rgba(166, 91, 75, 0.2)"],
      //   borderColor: ["rgba(166, 91, 75, 1)"],
      //   borderWidth: 3,
      // },
      // {
      //   label: "Mellan bil",
      //   data: carArrayMedium,
      //   backgroundColor: ["rgba(242, 203, 189, 0.2)"],
      //   borderColor: ["rgba(242, 203, 189, 1)"],
      //   borderWidth: 3,
      // },
      // {
      //   label: "Stor bil",
      //   data: carArrayLarge,
      //   backgroundColor: ["rgba(115, 59, 54, 0.2)"],
      //   borderColor: ["rgba(115, 59, 54, 1)"],
      //   borderWidth: 3,
      // },
    ],
  },
  options: {
    layout: {
      padding: 10,
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

chartHeader.innerHTML += `Beräknat pris för ${nights} nätter, med hyrd stuga:  ${
  livingArrayBudget[livingArrayBudget.length - 1]
}kr`;


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

    updatedTimeFinal = result[i][locationKey[i]].properties.meta.updated_at.slice(currenTimeIndex - 2, currenTimeIndex + 3)

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

function CheckDateTime() {
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
        // weatherIcon.push(weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Symbol"])
        // locationElements[i].innerHTML = `<h4>${locationKeys[i]},<br> ${weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Details"].air_temperature} c°</h4>
        // <img src=img/${weatherIcon[i]}.png alt="Weather Icon" height="50px" width="50px">
        // `
        if (destinationInput === locationKeys[i]) {
          weatherIcon.push(weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Symbol"])
            fishingWeatherDisplay.innerHTML = `<h4>${locationKeys[i]},<br> ${weatherDataFinal[i][locationKeys[i]].data[j]["Weather-Details"].air_temperature} c°</h4>
        <img src=img/${weatherIcon[i]}.png alt="Weather Icon" height="50px" width="50px">`
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
    GetAllWeatherData()
    CheckDateTime()
    }, 900000) //  900000 milisecounds, 15min interval update
}
GetAllWeatherData()   // Hämtar all väder-data och sorterar allting
CheckDateTime()       // Kollar vilket specifikt väder-objekt vi ska ta
IntervalLoop() // This function is asyncroumus