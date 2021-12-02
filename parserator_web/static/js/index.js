/* TODO: Flesh this out to connect the form to the API and render results
   in the #address-results div. */
"use strict"

const form = document.getElementsByClassName("form")

/*const csrftoken = getCookie('csrftoken');*/
const url = "api/parse/?"

async function getAddress () {
  const address = document.getElementById("address").value
  const response = await fetch(url + new URLSearchParams({address: address}))
  const data = await response.json()
  console.log(data)
  if (response.status !== 200) {
    console.log('Looks like there was a problem. Status Code: ' +
    response.status)
    throw data.detail
  }
  
  return data
}

function logSubmit (event) {
  event.preventDefault()
  const results = document.getElementById('address-results')
  const message = document.getElementById('error-message')
  const table = document.getElementsByClassName('table')[0]
  const type = document.getElementById('parse-type')
  const tbody = table.getElementsByTagName("tbody")[0]
  const p = document.createElement('p')
  tbody.innerHTML = ""
  results.style.display = "none"
  message.style.display = "none"

  getAddress ().then(data => {
    Object.keys(data.address_components).forEach(function (k) {
      const row = tbody.insertRow()
      const cell1 = row.insertCell(0) 
      const cell2 = row.insertCell(1)
      cell1.innerText = data.address_components[k] 
      cell2.innerText = k
    })
    type.innerText = data.address_type
    results.style.display = "inline"
  })
    .catch (err => {
      p.textContent = err
      p.innerHTML = p.innerHTML.replace(/\n/g, '<br>\n')
      message.innerHTML = ""
      message.append(p)
      message.style.display = "inline"
    })
}

form[0].addEventListener('submit', logSubmit)
