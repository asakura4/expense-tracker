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

        const totalAmount = records.reduce((total, record) => {
            return total + record.amount;
        }, 0)
        return res.render('index', { records, totalAmount})

    }catch(error){
        console.log(error)
    }

    
})

module.exports = router