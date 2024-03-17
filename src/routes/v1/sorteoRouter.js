const express = require('express');
const router = express.Router();
const {validateHeaders, validateBody} = require('../../midlwares/midlwares')
const {schemaValidarRegistroSorteo, schemaValidarActualizarSorteo, schemaEliminarSorteo} = require('../../utils/validationsYup')
const {regitrarSorteo, ActualizarSorteo, EliminarSorteo} = require('../../controllers/SorteoControllers')

router.post('/registrar-sorteo',validateBody(schemaValidarRegistroSorteo), regitrarSorteo);
router.post('/actualizar-sorteo',validateBody(schemaValidarActualizarSorteo), ActualizarSorteo);
router.post('/eliminar-sorteo', validateBody(schemaEliminarSorteo), EliminarSorteo);

module.exports = router;