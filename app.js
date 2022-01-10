const express = require('express')
const exphbs = require('express-handlebars')
if(process.env.NODE_ENV !== 'prod'){
    require('dotenv').config();
}


require('./config/mongoose')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(routes)

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
  })
  