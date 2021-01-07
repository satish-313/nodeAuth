const express = require('express')
const dotenv = require('dotenv')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()
dotenv.config();
const PORT = process.env.PORT || 5000

// passport config
require('./passport/passport')(passport)

// middleware
app.use(express.urlencoded({extended:false}))

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect flash
app.use(flash())

//ejs
app.use(expressLayout)
app.set('view engine', 'ejs')

// Routes
app.use('/',require('./routes/index'))
app.use('/user',require('./routes/user'))



// db
const url = process.env.MONGODB
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(() => console.log('connected to bd'))
  .catch(err => console.log(err))

app.listen(PORT, console.log(`Server is running on port ${PORT}`))

