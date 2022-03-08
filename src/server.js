var cookieSession = require('cookie-session')
const bodyParser = require('body-parser');
var express = require('express')
fs = require('fs');

const users = [

  {
    name: "user1",
    pass: "1234"
  },

  {
    name: "user2",
    pass: "4321"
  }

]

var app = express()
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


app.get('/login', (req, res, next) => {
  res.sendFile(__dirname + "/static/login.html")
})

app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  
  if (!users.find(({name, pass}) =>  name === username && pass === password )) {
    return res.send("Usuario o contrasenia no valida!")
  }

  
  req.session.username = username
  res.redirect('/')

});

app.get("/logout", (req, res) => {
  req.session = null
  res.redirect('/')
})



app.get('/',  (req, res, next) => {

  if (!req.session.username) {
    return res.sendFile(__dirname + "/static/index.html")
  }


  const values = {
    username: req.session.username
  }

  // Una simple implementacion de plantillas
  fs.readFile(__dirname + "/static/welcome.html", 'utf8', function(err, _data) {
    if (err) throw err;
    
    let data = _data.toString()

    for (const [key, value] of Object.entries(values)) {
      data = data.replaceAll("${" + key + "}", value)
    }
    res.send(data)
  })


})

app.listen(3000)
