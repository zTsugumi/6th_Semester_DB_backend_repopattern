var express = require('express')
const bodyParser = require('body-parser')
var authenticate = require('../helpers/authenticate')
const cors = require('./cors')

const favoriteCtrl = require('../controllers/favoriteCtrl')
var Favorites = require('../models/favorites')

var favoriteRouter = express.Router()
favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.jwtVerifyUser, favoriteCtrl.findAll)    
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, favoriteCtrl.create)        // POST a list of dishId from client, rarely use it
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, favoriteCtrl.deleteAll)

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.jwtVerifyUser, favoriteCtrl.find)
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, favoriteCtrl.createById)    // POST 1 dishId from client
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, favoriteCtrl.deleteOne)

module.exports = favoriteRouter 