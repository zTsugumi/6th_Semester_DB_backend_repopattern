const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../helpers/authenticate')
const cors = require('./cors')

const resCtrl = require('../controllers/resCtrl')

const reservationRouter = express.Router()
reservationRouter.use(bodyParser.json())

reservationRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.jwtVerifyUser, resCtrl.findAll)
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, resCtrl.create)
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, resCtrl.deleteAll)

reservationRouter.route('/:resId1/:resId2')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, resCtrl.update)
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, resCtrl.deleteOne)

module.exports = reservationRouter