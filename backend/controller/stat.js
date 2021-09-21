/**
 * --- This file contains an implementation of the requests w.r.t. statistics ---
 */

const Movie = require('../models/movie')
const errorHandler = require('../util/errorHandler')
const converterToCSV = require('../util/csvConverter')
const axios = require('axios')

/**
 * --- Retrieve Mean, Median, SD for popularity of movies w.r.t. actor and a specific year ---
 */
module.exports.getByName = async function (req, res) {
  // Case insensitivity
  const regex = new RegExp(['^', req.params.name, '$'].join(''), 'i')
  const statistics = {}
  const query = { actors: regex }
  const year = req.query.year
  // Declare variables
  if (year) {
    query.year = year
  }
  const movies = await getMovies(query)

  if (movies.length === 0) {
    res.status(404).json({
      message: 'not found'
    })
    return
  }

  statistics.mean = getMean(movies) // Compute mean from the documents
  statistics.sd = getSD(movies) // Compute standard deviation from the documents
  statistics.median = getMedian(movies) // Compute median from the documents

  // Compute the user ratings - prepare the data for the chart
  let scores = new Set()
  movies.forEach(elem => {
    scores.add(elem.users_rating)
  })
  scores = Array.from(scores)
  scores = scores.sort((a, b) => a - b)
  // Initialize the histograms with zeros
  const counts = []
  for (let i = 0; i < scores.length; i++) {
    counts.push(0)
  }
  // Fill up the histogram with the scores
  movies.forEach(elem => {
    counts[scores.indexOf(elem.users_rating)]++
  })
  // Create chart
  const chart = {
    type: 'bar',
    data: {
      labels: scores,
      datasets: [
        {
          label: 'Movies',
          data: counts
        }
      ]
    }
  }

  // Sending the request to the API
  try {
    const response = await getRes(chart)
    statistics.url = response.data.url
  } catch (err) {
    errorHandler(res, err)
  }

  if (req.headers.accept === 'text/csv') {
    const csvObject = converterToCSV.convertStatistics(statistics)
    res.setHeader('content-type', 'text/csv')
    res.status(200).send(csvObject)
    return
  }

  // Return result
  res.status(200).json({
    message: 'success',
    statistics: statistics
  })
}

/**
 * Function to compute the median value of the popularity of the movies
 */
const getMedian = function (movies) {
  movies = movies.filter(movie => movie.users_rating !== undefined)
  movies.sort(function (a, b) {
    return a.users_rating - b.users_rating
  })
  if (movies.length % 2 === 0) {
    return (
      (parseFloat(movies[parseInt(movies.length / 2) - 1].users_rating) +
        parseFloat(movies[parseInt(movies.length / 2)].users_rating)) /
      2
    )
  }
  return parseFloat(movies[parseInt(movies.length / 2)].users_rating)
}

/**
 * Function to compute the mean value of the popularity of the movies
 */
const getMean = function (movies) {
  if (movies.length === 0) return 0
  let mean = 0
  let length = 0
  for (let i = 0; i < movies.length; i++) {
    if (movies[i].users_rating) {
      mean += parseFloat(movies[i].users_rating)
      length++
    }
  }
  return mean / length
}

/**
 * Function to compute the standard deviation for popularity of movies
 */
const getSD = function (movies) {
  const mean = getMean(movies)
  let sum = 0
  let length = 0
  if (movies.length === 0 || movies.length === 1) return 0
  for (let i = 0; i < movies.length; i++) {
    if (movies[i].users_rating) {
      sum +=
        (parseFloat(movies[i].users_rating) - mean) *
        (parseFloat(movies[i].users_rating) - mean)
      length++
    }
  }
  return Math.sqrt(sum / (length - 1))
}

/**
 * Function for accesing the thir party charts API
 */
const getRes = function (chart) {
  return axios.post('https://quickchart.io/chart/create', {
    chart
  })
}

/**
 * Function for getting the movies according to the querry
 */
const getMovies = function (query) {
  return Movie.find(query)
}
