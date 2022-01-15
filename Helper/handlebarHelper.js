const exphbs = require('express-handlebars')
const moment = require('moment')
const { CATEGORY } = require('../config/icon')

const handlebarHelper= {
    dateFormat: function(datetime){
        return moment(datetime).format("YYYY-MM-DD");
    },
    
    iconLink: function(property){
        return CATEGORY[property]
    }
}



module.exports = { handlebarHelper }
