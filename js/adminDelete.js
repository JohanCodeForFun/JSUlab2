
let idInputElement = document.querySelector('#idInput')


// Funktion som delettar från json-filen
function DeletePost() {
  // Input validation
  let idInputValue =  idInputElement.value
  let idInputPattern = /[0-9]+/;
  let idInputCheck = idInputPattern.test(idInputValue)

  if(idInputCheck === true) {
    let idValue = Number(idInputElement.value)
    axios.get('http://localhost:3000/adminUpload').then(result => {
      if(result.data.length >= 1) {
        for(let i = 0; i < result.data.length; i++) {
          if(idValue === result.data[i].id) {
            axios.delete('http://localhost:3000/adminUpload/' + idValue)
            break;
          }
          else if (i === (result.data.length - 1)) {
            alert("Ogiltigt id!")
          }
        }
      }
      else {
        alert("Finns inge att ta bort!")
      }
    })
  }
  else {
    alert("FEL! bara siffror")
  }
}
