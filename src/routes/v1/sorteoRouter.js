const express = require('express');
const router = express.Router();
const {validateHeaders, validateBody} = require('../../midlwares/midlwares')
const {
    schemaValidarRegistroSorteo,
    schemaValidarActualizarSorteo,
    schemaEliminarSorteo,
    schemaListadoSorteoByFecha,
    schemaDetalleSorteoID,
} = require('../../utils/validationsYup')
const {
    regitrarSorteo,
    ActualizarSorteo, 
    EliminarSorteo,
    obtenerListaSorteoByFecha,
    obtenerDetalleSorteo
} = require('../../controllers/SorteoControllers')

router.post('/registrar-sorteo',validateBody(schemaValidarRegistroSorteo), regitrarSorteo);
router.post('/actualizar-sorteo',validateBody(schemaValidarActualizarSorteo), ActualizarSorteo);
router.post('/eliminar-sorteo', validateBody(schemaEliminarSorteo), EliminarSorteo);
router.post('/listado/sorteo/fecha-rango', validateBody(schemaListadoSorteoByFecha), obtenerListaSorteoByFecha);

router.post('/detalle/sorteo', validateBody(schemaDetalleSorteoID), obtenerDetalleSorteo);

module.exports = router;