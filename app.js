const express = require('express')
const exphbs = require('express-handlebars')
if(process.env.NODE_ENV !== 'prod'){
    require('dotenv').config();
}

const path = require('path')
require('./config/mongoose')
const routes = require('./routes')
const {handlebarHelper} = require('./Helper/handlebarHelper');
const { Http2ServerRequest } = require('http2');

const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

const hbs = exphbs.create({})

hbs.handlebars.registerHelper('formatDate', handlebarHelper.dateFormat)
hbs.handlebars.registerHelper('iconLink', handlebarHelper.iconLink)

app.use(express.static(path.join(__dirname, '/public')))
app.use((req, res, next)=>{
    res.locals.isAuthenticated = false;
    next()
})

app.use(routes)

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})
  