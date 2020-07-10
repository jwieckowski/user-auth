const inputs = [...document.getElementsByTagName('input')]

const userInputs = {
  login: undefined,
  password: undefined
}

const fetchLoginUser = async (user) => {
  await fetch(`/api/v1/users/${user.login}`, {
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    mode: 'no-cors',
    body: JSON.stringify(user)
  })
    .then(response => response)
    .then((data) => {
      data.status === 200
       ? window.location.replace('/welcome.html')
       : window.alert('Bad authentication process')
    })
    .catch((error) => {
      window.alert('Cannot logged in')
    })
}

const inputsFilled = () => !inputs.some(input => input.value === '')
const clearInputs = () => inputs.map(input => input.value = undefined)
const displayAlert = async () => !inputsFilled() && window.alert('Inputs were not filled')

const checkData = (type) => {
  const types = {
    login: inputs[0].value,
    password: inputs[1].value
  }
  return types[type] || undefined
}

const getUserInputs = async () => {
  if(inputs.length === 0) return

  inputs.map(input => userInputs[input.getAttribute('data-type')] = checkData(input.getAttribute('data-type')))
  inputsFilled()
    ? await fetchLoginUser(userInputs)
    : displayAlert()
}

document.getElementById('submit-button').addEventListener('click', getUserInputs)
