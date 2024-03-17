const express = require('express');
const router = express.Router();
const {validateHeaders} = require('../../midlwares/midlwares')
//const {schemaValidarLogin} = require('../../utils/validationsYup')
const {regitrarSorteo, ActualizarSorteo} = require('../../controllers/SorteoControllers')

router.post('/registrar-sorteo', regitrarSorteo);
router.post('/actualizar-sorteo', ActualizarSorteo);


module.exports = router;