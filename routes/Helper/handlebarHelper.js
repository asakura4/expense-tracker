const moment = require('moment')
const { CATEGORY } = require('../../config/icon')

const handlebarHelper = {
  dateFormat: function (datetime) {
    return moment.utc(datetime).format('YYYY-MM-DD')
  },

  iconLink: function (property) {
    return CATEGORY[property]
  },
  option: function (value, selectedValue) {
    const selectedProperty = value == selectedValue ? 'selected="selected"' : ''
    return '<option value="' + value + '"' + selectedProperty + '>' + value + '</option>'
  }
}

module.exports = { handlebarHelper }
