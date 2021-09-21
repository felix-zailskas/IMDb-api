/**
 * --- This file contains the schema definition of the movie ---
 */

const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  rating: {
    type: String
  },
  year: {
    type: String
  },
  users_rating: {
    type: String
  },
  votes: {
    type: String
  },
  metascore: {
    type: String
  },
  img_url: {
    type: String
  },
  countries: {
    type: [String],
    required: true
  },
  languages: {
    type: [String],
    required: true
  },
  actors: {
    type: [String],
    required: true
  },
  genre: {
    type: [String],
    required: true
  },
  tagline: {
    type: String
  },
  description: {
    type: String
  },
  directors: {
    type: [String],
    required: true
  },
  runtime: {
    type: String
  },
  imdb_url: {
    // imdb_url serves as an ID
    type: String,
    index: true,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('Movie2db', movieSchema)
