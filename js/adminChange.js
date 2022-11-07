// Variablar för imagen
let imageUrl = "";
let imageCheck = false;

// ELEMENTS
let imageInput = document.querySelector('#imageInput')
let idInputElement = document.querySelector('#idInput')
let nameInputElement = document.querySelector('#nameInput')
let fishInputElement = document.querySelector('#fishInput')
let fishWeightElement = document.querySelector('#fishWeightInput')
let descriptionElement = document.querySelector('#description')

// Fångar bilden som användaren sparar
imageInput.addEventListener('change', function() {
  const reader = new FileReader()
  reader.readAsDataURL(this.files[0])

  reader.addEventListener('load', () => {
    imageCheck = true;
    imageUrl = reader.result
  })
})

// Funktion som kommer kolla om id:et och resten av datat användaren skriver in är rätt
function SubmitChange() {
  let idInputValue =  idInputElement.value
  let idInputPattern = /[0-9]+/;
  let idInputCheck = idInputPattern.test(idInputValue)

  if(idInputCheck === true) {
    axios.get('http://localhost:3000/adminUpload').then(result => {
      if(result.data.length > 0) {
        console.log(result)
        for(let i = 0; i < result.data.length; i++) {
          if(result.data[i].id === Number(idInputValue)) {
            localStorage.setItem('updateCheck', JSON.stringify(true))
            localStorage.setItem('idIndexValue', JSON.stringify(idIndexValue))
            break;
          }
          else if (i === (result.data.length - 1) && result.data[i].id !== Number(idInputValue)) {
            // console.log(updateCheck)
            localStorage.setItem('updateCheck', JSON.stringify(false))
          }
        }
      }
    })
  }
  // Här nere kollar princip vad användaren skriver för data och jämför idet om det är rätt
  let updateCheck = JSON.parse(localStorage.getItem('updateCheck'))
  let idIndexValue = JSON.parse(localStorage.getItem('idIndexValue'))

  let nameValue = nameInputElement.value
  let namePattern = /[a-öA-Ö]{2,20}/;
  let nameCheck = namePattern.test(nameValue)

  let fishTypeValue = fishInputElement.value
  let fishTypePattern = /[a-öA-Ö]{2,30}/;
  let fishTypeCheck = fishTypePattern.test(fishTypeValue)

  let fishWeightValue =  fishWeightElement.value
  let fishWeightPattern = /[0-9a-öA-Ö ]{2,40}/;
  let fishWeightCheck = fishWeightPattern.test(fishWeightValue)

  let textDescriptionValue = descriptionElement.value
  let textDescriptionPattern = /[0-9a-öA-Ö !"#¤%&/()=?]+/;
  let textDescriptionCheck = textDescriptionPattern.test(textDescriptionValue)

  if(nameCheck === true && textDescriptionCheck === true && fishWeightCheck === true && fishTypeCheck === true && imageUrl !== "" && updateCheck === true) {
    axios.put('http://localhost:3000/adminUpload/' + idIndexValue, {
        id: Number(idIndexValue),
        name: nameValue,
        fishType: fishTypeValue,
        fishWeight: fishWeightValue,
        image: imageUrl,
        textDescription: textDescriptionValue
      })
      .then(result => {
        console.log(result.data)
      })
      .catch(error => console.log(error.response))
  }

  else {
    alert("Fel! Försök igen!")
  }
}
