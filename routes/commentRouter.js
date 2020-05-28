const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../helpers/authenticate')
const cors = require('./cors')

const commentCtrl = require('../controllers/commentCtrl')

const commentRouter = express.Router()
commentRouter.use(bodyParser.json())

commentRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, commentCtrl.findAll)
    .post(cors.corsWithOptions, authenticate.jwtVerifyUser, commentCtrl.create)    
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, commentCtrl.deleteAll)

commentRouter.route('/:commentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, commentCtrl.find)
    .put(cors.corsWithOptions, authenticate.jwtVerifyUser, commentCtrl.update)
    .delete(cors.corsWithOptions, authenticate.jwtVerifyUser, commentCtrl.deleteOne)

module.exports = commentRouter