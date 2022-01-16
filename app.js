const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'prod') {
  require('dotenv').config()
}

const path = require('path')
require('./config/mongoose')
const usePassport = require('./config/passport')
const { handlebarHelper } = require('./routes/Helper/handlebarHelper')

const app = express()
const routes = require('./routes')
const PORT = process.env.PORT

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const hbs = exphbs.create({})
hbs.handlebars.registerHelper('formatDate', handlebarHelper.dateFormat)
hbs.handlebars.registerHelper('iconLink', handlebarHelper.iconLink)
hbs.handlebars.registerHelper('option', handlebarHelper.option)

// CSS file setting
app.use(express.static(path.join(__dirname, '/public')))
usePassport(app)

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
