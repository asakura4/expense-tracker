const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

const User = require('../../models/user')
const { reset } = require('nodemon')


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

    try{
        const categories = await Category.find().lean()
        return res.render('new',{ categories })
    }catch(error){
        console.log(error)
        res.redirect('/')
    }
    

})

router.get('/category/:categoryId', async (req, res) => {
    try{
        const categoryId = req.params.categoryId
        //const userId = req.user._id

        const records = await Record.find({ })
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

router.get('/:id/edit', async (req, res) => {

    try{
        // const userId = req.user._id
        const _id = req.params.id
        const categories = await Category.find().lean()
        const record = await Record.findOne({ _id })
            .populate('categoryId')
            .lean()
        
            console.log(record)

        return res.render('edit',{ record, categories })
    }catch(error){
        console.log(error)
        return res.redirect('/')
    }
    // const userId = req.user._id
    // return Record.findOne({ _id, userId })
    //   .lean()
    //   .then(record => res.render('edit', { record }))
    //   .catch(error => console.log(error))
})

router.put('/:id', async (req, res) => {
    const _id = req.params.id
    //const userId = req.user._id

    //test
    const user = await User.findOne({name: "廣志"}).lean()

    const { name, date, category, amount } = req.body
    const returnCategory= await Category.findOne({name: category}).lean()

    return await Record.findOne({ _id })
    .then(record => {
        record.name = name,
        record.date = date,
        record.categoryId = returnCategory._id,
        record.userId = user._id,
        record.amount = amount
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))


    // return Restaurant.findOne({ _id, userId })
    //   .then(restaurant => {
    //     restaurant.name = name
    //     restaurant.name_en = name_en
    //     restaurant.category = category
    //     restaurant.image = image
    //     restaurant.address = address
    //     restaurant.phone = phone
    //     restaurant.rating = rating
    //     restaurant.description = description
    //     return restaurant.save()
    //   })
    //   .then(() => res.redirect(`/restaurants/${_id}`))
    //   .catch(error => console.log(error))
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