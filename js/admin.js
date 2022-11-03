
let nameInputElement = document.querySelector('#nameInput')
let fishInputElement = document.querySelector('#fishInput')
let fishWeightElement = document.querySelector('#fishWeightInput')
let descriptionElement = document.querySelector('#description')
let image_Input = document.querySelector('#image-input')
let image_display = document.querySelector('.image-display')

let textDescription = document.querySelector('#description')

// Imagen
let imageUrl = ""
let imageCheck;


// Läser in imagen och lägger den i imageUrl
image_Input.addEventListener('change', function() {
  const reader = new FileReader()
  reader.readAsDataURL(this.files[0])

  reader.addEventListener('load', () => {
    imageCheck = true;
    imageUrl = reader.result

  })
})

// Här kollar jag anvädarens data och postar till json-filen om det är korrekt, via axios
function SubmitValidation() {
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

  if(nameCheck === true && textDescriptionCheck === true && fishWeightCheck === true && fishTypeCheck === true && imageUrl !== "") {
    axios.post('http://localhost:3000/adminUpload', {
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
    alert("FEL! försök igen!")
  }
}
