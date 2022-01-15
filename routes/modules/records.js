const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

const User = require('../../models/user')


router.post('/', async (req, res) => {

    try{
        const { name, date, category, amount } = req.body
        const returnCategory= await Category.findOne({name: category}).lean()
        
        //const userId = req.user._id
        //test
        const user = await User.findOne({name: "廣志"}).lean()
    
        await Record.create({
            name, 
            date,
            categoryId: returnCategory._id,
            userId: user._id,
            amount
        })
        return res.redirect('/')        
    }catch(error){
        console.log(error)
    }
})


router.get('/new', async (req, res) => {

    const categories = await Category.find().lean()
    return res.render('new',{ categories })

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
      .then(Record => Record.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
    //const userId = req.user._id
    // return Restaurant.findOne({ _id, userId })
    //   .then(restaurant => restaurant.remove())
    //   .then(() => res.redirect('/'))
    //   .catch(error => console.log(error))
  })



module.exports = router