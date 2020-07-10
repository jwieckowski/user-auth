const inputs = [...document.getElementsByTagName('input')]

const userInputs = {
  login: undefined,
  password: undefined,
  confirmPassword: undefined
}

const fetchLogins = async () => {
  return fetch('/api/v1/users')
    .then(response => response.json())
    .then(data => {
      return data
    })
}

const fetchRegisterUser = async (user) => {
  await fetch('/api/v1/users', {
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    mode: 'no-cors',
    body: JSON.stringify(user)
  })
    .then(response => response)
    .then((data) => {
      window.location.replace('/login.html')
    })
    .catch((error) => {
      window.alert('Cannot register user')
    })
}

const loginUnique = async (newUser) => {
  const users = await fetchLogins()
  return users.find(user => user.login === newUser.login) === undefined
}

const inputsFilled = () => !inputs.some(input => input.value === '')

const passwordsCorrect = (user) => user.password === user.confirmPassword

const checkData = (type) => {
  const types = {
    login: inputs[0].value,
    password: inputs[1].value,
    confirmPassword: inputs[2].value
  }
  return types[type] || undefined
}

const displayAlert = async () => {
  !inputsFilled()
    ? window.alert('Inputs were not filled')
    : ! await loginUnique(userInputs)
      ? window.alert('Login already exists')
      : !passwordsCorrect(userInputs) && window.alert('Passwords are not the same')
}

const getUserInputs = async () => {
  if(inputs.length === 0) return

  inputs.map(input => userInputs[input.getAttribute('data-type')] = checkData(input.getAttribute('data-type')))
  inputsFilled() && await loginUnique(userInputs) && passwordsCorrect(userInputs)
    ? await fetchRegisterUser(userInputs)
    : displayAlert()
}

document.getElementById('submit-button').addEventListener('click', getUserInputs)
