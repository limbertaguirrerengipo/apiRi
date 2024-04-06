const express = require('express');
const router = express.Router();
const {validateHeaders, validateBody} = require('../../midlwares/midlwares')
const {
    schemaValidarRegistroSorteo,
    schemaValidarActualizarSorteo,
    schemaEliminarSorteo,
    schemaListadoSorteoByFecha,
    schemaDetalleSorteoID,
    schemaTicketSorteo,
    schemaDetalleTickets,
    schemaDetalleClienteSorteo,
    schemaDetalleCliente
} = require('../../utils/validationsYup')
const {
    regitrarSorteo,
    ActualizarSorteo, 
    EliminarSorteo,
    obtenerListaSorteoByFecha,
    obtenerDetalleSorteo,
    registrarTicket,
    obtenerDetalleTicketsById,
    listaDetalleClienteXSorteo,
    listaDetalleSorteoCienteId
} = require('../../controllers/SorteoControllers')

router.post('/registrar-sorteo',validateBody(schemaValidarRegistroSorteo), regitrarSorteo);
router.post('/actualizar-sorteo',validateBody(schemaValidarActualizarSorteo), ActualizarSorteo);
router.post('/eliminar-sorteo', validateBody(schemaEliminarSorteo), EliminarSorteo);
router.post('/listado/sorteo/fecha-rango', validateBody(schemaListadoSorteoByFecha), obtenerListaSorteoByFecha);

router.post('/detalle/sorteo', validateBody(schemaDetalleSorteoID), obtenerDetalleSorteo);
router.post('/crear/ticket-cliente', validateBody(schemaTicketSorteo), registrarTicket);

router.post('/lista/detalle-tickets', validateBody(schemaDetalleTickets), obtenerDetalleTicketsById);

//detalles
router.post('/lista/sorteo/detalle-clientes', validateBody(schemaDetalleClienteSorteo), listaDetalleClienteXSorteo);
router.post('/lista/detalle/cliente', validateBody(schemaDetalleCliente), listaDetalleSorteoCienteId);


module.exports = router;