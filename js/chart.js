// 1. Få all data från andra sidan
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

let destinationInput = urlParams.get('destination');
let startpointInput = urlParams.get('startpoint');
let vechileInput = urlParams.get('vechile');

let guideInput = urlParams.get('guide');
let equipementInput = urlParams.get('equipement');

let nightValue = Number(urlParams.get('night'));
console.log(nightValue)

let guideValue = 0;
let equipementValue = 0;

if(guideInput !== "no-guide") {
  guideValue = Number(guideInput);
}

if(equipementInput !== "no-equipement") {
  equipementValue = Number(equipementInput)
}

console.log(guideValue)
console.log(equipementValue);
console.log(destinationInput);
console.log(startpointInput);
console.log(vechileInput);

// 2. Funktioner för att visa graf med Chart.js

// funktion, visa bil eller boende graf med radio knappar

// let graphSelect = () => {

// }

// funktion för hur många nätter
nights = 0;
nights = 42;

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
    console.log(carArrayLarge);
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
      {
        label: "Liten bil",
        data: carArraySmall,
        backgroundColor: ["rgba(166, 91, 75, 0.2)"],
        borderColor: ["rgba(166, 91, 75, 1)"],
        borderWidth: 3,
      },
      {
        label: "Mellan bil",
        data: carArrayMedium,
        backgroundColor: ["rgba(242, 203, 189, 0.2)"],
        borderColor: ["rgba(242, 203, 189, 1)"],
        borderWidth: 3,
      },
      {
        label: "Stor bil",
        data: carArrayLarge,
        backgroundColor: ["rgba(115, 59, 54, 0.2)"],
        borderColor: ["rgba(115, 59, 54, 1)"],
        borderWidth: 3,
      },
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

addEventListener("change", () => {
  // if radio === car => show car gas price graph
  // if radio === living => show living expenses graph
});
