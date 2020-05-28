var express = require('express')
const bodyParser = require('body-parser')
var authenticate = require('../helpers/authenticate')
const cors = require('./cors')

const userCtrl = require('../controllers/userCtrl')

var router = express.Router()
router.use(bodyParser.json())

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
router.get('/', cors.corsWithOptions, authenticate.jwtVerifyUser, authenticate.verifyAdmin, userCtrl.findAll)
router.post('/signup', cors.corsWithOptions, userCtrl.create)
router.post('/login', cors.corsWithOptions, userCtrl.login)
//router.post('/logout', cors.corsWithOptions, userCtrl.logout)   // ?? Can add a blacklist for token

module.exports = router
