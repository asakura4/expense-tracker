const exphbs = require('express-handlebars')
const moment = require('moment')
const { CATEGORY } = require('../config/icon');
const category = require('../models/category');


const hbs = exphbs.create({})
const handlebarHelper= {
    dateFormat: function(datetime){
        return moment.utc(datetime).format("YYYY-MM-DD");
    },
    
    iconLink: function(property){
        return CATEGORY[property]
    },
    option: function(value, selectedValue){
        var selectedProperty = value == selectedValue ? 'selected="selected"' : '';
        return '<option value="' + value + '"' +  selectedProperty + '>' + value + "</option>";
    }
}



module.exports = { handlebarHelper }
