
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const Category = require('../category')
const categories = require('./Data/category.json').results
const db = require('../../config/mongoose')


db.once('open', () => {
    console.log('CategorySeeder start!')
    Promise.all(categories.map(category => {
        return Category.create({
            id: category.id,
            name: category.name
        })
    })).then(() => {
        console.log('CategorySeeder end!')
        process.exit()
    })
    .catch((err) => console.log(err))
})