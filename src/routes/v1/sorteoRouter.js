const express = require('express');
const router = express.Router();
const {validateHeaders} = require('../../midlwares/midlwares')
//const {schemaValidarLogin} = require('../../utils/validationsYup')
const {regitrarSorteo} = require('../../controllers/SorteoControllers')

router.post('/registrar-sorteo', regitrarSorteo);

module.exports = router;