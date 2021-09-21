/**
 * --- This file implements the CSV conersion functions ---
 */

const Papa = require('papaparse')

/**
 * Convert a json object to csv object
 */
module.exports.convertObject = function (documents) {
  let fields = Object.getOwnPropertyNames(documents[0].toObject())
  fields = fields.filter(str => str !== '_id' && str !== '__v')
  return Papa.unparse({
    fields: fields,
    data: documents
  })
}

/**
 * Converts a json object to csv object for the statistics requests
 */
module.exports.convertStatistics = function (object) {
  const docs = [object]
  console.log(docs)
  const fields = ['mean', 'sd', 'median', 'url']
  return Papa.unparse({
    fields: fields,
    data: docs
  })
}

/**
 * Converts an array into a csv object
 */
module.exports.convertArray = function (fields, array) {
  const list = []
  array.forEach(elem => {
    list.push({ Name: elem })
  })
  return Papa.unparse({
    fields: fields,
    data: list
  })
}
