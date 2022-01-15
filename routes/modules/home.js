const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res) => {
    try{
        const records = await Record.find({})
        .populate('categoryId')
        .lean()
        .sort({date: 'asc'})


        const categories = await Category.find()
        .lean()

        // console.log(records)
        // console.log(categories)
        const totalAmount = records.reduce((total, record) => {
            return total + record.amount;
        }, 0)
        return res.render('index', { records, totalAmount, categories})

    }catch(error){
        console.log(error)
    }
})

module.exports = router