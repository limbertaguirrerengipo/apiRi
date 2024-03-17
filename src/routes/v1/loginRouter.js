const express = require('express');
const router = express.Router();
const {validateHeaders} = require('../../midlwares/midlwares')
const {schemaValidarLogin} = require('../../utils/validationsYup')
const {login} = require('../../controllers/LoginControllers')

router.get('/login', validateHeaders(schemaValidarLogin), login);

module.exports = router;