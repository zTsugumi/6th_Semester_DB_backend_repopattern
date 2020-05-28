const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../helpers/authenticate')
const cors = require('./cors')

const dishCtrl = require('../controllers/dishCtrl')

const dishRouter = express.Router()
dishRouter.use(bodyParser.json())

dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, dishCtrl.findAll)
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, dishCtrl.create)
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, dishCtrl.deleteAll)

dishRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, dishCtrl.find)
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, dishCtrl.update)
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, dishCtrl.deleteOne)

module.exports = dishRouter