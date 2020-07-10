const express = require('express')
const path = require('path')

const bcrypt = require('bcrypt')

const users = []

const app = express()

app.use(express.json({
  type: ['application/json', 'text/plain']
}))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'))
})

app.get('/api/v1/users', (req, res) => {
  res.json(users)
})

app.post('/api/v1/users', async (req, res) => {
  if (users.filter(user => user.login === req.body.login).length !== 0) {
    return res.status(400).send()
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { login: req.body.login, password: hashedPassword }
    users.push(user)
    return res.status(201).send()
  } catch {
    return res.status(500).send()
  }
})

app.post('/api/v1/users/:login', async (req, res) => {
  const user = users.find(user => user.login === req.body.login)
  if (user === undefined) return res.status(400).send('Cannot find user')

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      return res.status(200).send()
    } else {
      return res.status(401).send()
    }
  } catch {
    return res.status(500).send()
  }
})

app.listen(3000)