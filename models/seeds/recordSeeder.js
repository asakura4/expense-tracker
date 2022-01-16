const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const User = require('../user')
const Record = require('../record')
const Category = require('../category')

const db = require('../../config/mongoose')
const seedUsers = require('../seeds/Data/user.json').results
const records = require('../seeds/Data/record.json').results
const record = require('../record')
const user = require('../user')
const category = require('../category')

db.once('open', async () => {
  try {
    console.log('recordSeeder start!')
    // const categoryInRecords = records.map(record => record.category)
    //     .filter((v, i, a) => a.indexOf(v) === i)
    const categoryLists = await Category.find()

    await Promise.all(seedUsers.map(async (seedUser) => {
      const hash = await bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(seedUser.password, salt))

      const createdUser = await User.create({
        name: seedUser.name,
        email: seedUser.email,
        password: hash
      })

      const recordList = records.filter(record => record.user == createdUser.name)
      await Promise.all(recordList.map(async (record) => {
        const category = categoryLists.filter(category => category.name === record.category)
        return await Record.create({
          name: record.name,
          date: record.date,
          amount: record.amount,
          userId: createdUser._id,
          categoryId: category[0]._id
        })
      }))
    }))
    console.log('recordSeeder end!')
  } catch (error) {
    console.log(error)
    console.log('recordSeeder end! abnormally')
  }
  process.exit()
})
