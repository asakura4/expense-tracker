const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')


router.get('/new', (req, res) => {
    return res.render('new')

})

router.get('/category/:categoryId', async (req, res) => {
    try{
        const categoryId = req.params.categoryId
        //const userId = req.user._id

        const records = await Record.find({
            
        })
        .populate('categoryId')
        .lean()
        .sort({date: 'asc'})

        const categories = await Category.find()
        .lean()
        const selectedCategory = categories.filter(category => category._id == categoryId)[0]
        const filterRecords = records.filter(record => record.categoryId._id == categoryId)

        const totalAmount = filterRecords.reduce((total, record) => {
            return total + record.amount;
        }, 0)
        return res.render('index', { records: filterRecords, totalAmount, categories, selectedCategory})

    }catch(error){
        console.log(error)
    }

})

router.delete('/:id', (req, res) => {
    const _id = req.params.id
    //const userId = req.user._id
    return Record.findOne({ _id })
      .then(restaurant => restaurant.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
    //const userId = req.user._id
    // return Restaurant.findOne({ _id, userId })
    //   .then(restaurant => restaurant.remove())
    //   .then(() => res.redirect('/'))
    //   .catch(error => console.log(error))
  })



module.exports = router