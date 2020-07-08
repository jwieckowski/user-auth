const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const bcrypt = require('bcrypt')

const users = []

const app = express()
// app.use(express.json())
// app.use(serveStatic('/public', { 'index': ['default.html', 'default.htm'] }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
  if (users.filter(user => user.login === req.body.login).length !== 0) {
    res.status(400).send()
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { login: req.body.login, password: hashedPassword }
    users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/:login', async (req, res) => {
  const user = users.find(user => user.login === req.body.login)
  if (user === null) return res.status(400).send('Cannot find user')

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Wrong password')
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(3000)