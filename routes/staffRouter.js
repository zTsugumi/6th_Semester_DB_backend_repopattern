const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../helpers/authenticate')
const cors = require('./cors')

const staffCtrl = require('../controllers/staffCtrl')

const staffRouter = express.Router()
staffRouter.use(bodyParser.json())

staffRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, staffCtrl.findAll)
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, staffCtrl.create)
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, staffCtrl.deleteAll)

staffRouter.route('/:staffId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, staffCtrl.find)
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, staffCtrl.update)
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, staffCtrl.deleteOne)

module.exports = staffRouter