const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    const loginUser = await User.findById(userId).lean()
    const categories = await Category.find()
      .lean()

    const records = await Record.find({ userId })
      .populate('categoryId')
      .lean()
      .sort({ date: 'asc' })
    const totalAmount = records.reduce((total, record) => {
      return total + record.amount
    }, 0)
    return res.render('index', { loginUser, records, totalAmount, categories })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
