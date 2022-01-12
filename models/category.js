const mongoose = require('mongoose')
const db = require('../config/mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    
    name: {
        type: String,
        required: true,
        unique: true
    }

})

module.exports = mongoose.model('Category', categorySchema)