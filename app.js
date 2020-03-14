const express = require('express')
const routes = require('./routes/router')
const cors = require('cors')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const morgan = require('morgan')
const Chat = require('./models/Chat')

//App Initialization
const app = express()

//Socketio Initialization
var server = require('http').Server(app)
var io = require('socket.io')(server)
io.on('connection', function (socket) {
  socket.on('orderSend', function (data) {
    var chat = new Chat(data)
    chat.save()
    io.emit('orderReceive', data)
  })
  socket.on('salesSend', function (data) {
    var chat = new Chat(data)
    chat.save()
    io.emit('salesReceive', data)
  })
})

//Database Initialization
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Connected DB')
    }
  }
)

//Initializing Cross-Origin Resource
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cookieParser())

//View-Engine
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

// Connect flash
app.use(flash())

//Static FIles
app.use(express.static('public'))

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

//Root Route
app.use('/', routes)

//Error Handler
app.use((req, res, next) => {
  res.render('error', { userData: req.userData })
})

//Port to Listen
//App Serving
var port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
