const express = require('express');
const multer = require('multer');
const router = express.Router()

const AuthController = require('../controllers/AuthController')

router.post('/register', multer().none(), AuthController.register);
router.post('/login', AuthController.login)

module.exports = router;