const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

const User = require('../../models/user')


router.post('/', async (req, res) => {

    try{
        const { name, date, category, amount } = req.body
        const returnCategory= await Category.findOne({name: category}).lean()
        const userId = req.user._id

        await Record.create({
            name, 
            date,
            categoryId: returnCategory._id,
            userId: userId,
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
        const userId = req.user._id
        const loginUser = await User.findById(userId).lean()

        const records = await Record.find({ userId })
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
        return res.render('index', { loginUser, records: filterRecords, totalAmount, categories, selectedCategory})

    }catch(error){
        console.log(error)
    }

})

router.get('/:id/edit', async (req, res) => {

    try{
        const userId = req.user._id
        const _id = req.params.id
        const categories = await Category.find().lean()
        const record = await Record.findOne({ _id, userId })
            .populate('categoryId')
            .lean()
        return res.render('edit',{ record, categories })
    }catch(error){
        console.log(error)
        return res.redirect('/')
    }
})

router.put('/:id', async (req, res) => {
    const _id = req.params.id
    const userId = req.user._id
    const { name, date, category, amount } = req.body
    try{
        const returnCategory= await Category.findOne({name: category}).lean()
        await Record.findOne({ _id, userId })
            .then(record => {
                record.name = name,
                record.date = date,
                record.categoryId = returnCategory._id,
                record.userId = userId,
                record.amount = amount
            return record.save()
        })

        return res.redirect('/')
    }catch(error){
        console.log(error)
    }
})

router.delete('/:id', async (req, res) => {
    const _id = req.params.id
    const userId = req.user._id
    try{
        await Record.findOne({ _id, userId })
        .then(Record => Record.remove())

        return res.redirect('/')

    }catch(error){
        console.log(error)
    }
})



module.exports = router