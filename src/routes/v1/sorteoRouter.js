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
    schemaDetalleCliente,
    schemaEliminarCliente,
    schemaListaSorteoCliente
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
    listaDetalleSorteoCienteId,
    updateAplicarTicketCliente,
    eliminarTicketCliente,
    obtenerTodosSorteosId,
    obtenerTipoPagos
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

router.post('/aplicar/pagos/update-estado', updateAplicarTicketCliente);

router.post('/eliminar/tickets/cliente', validateBody(schemaEliminarCliente), eliminarTicketCliente);
router.post('/lista/sorteo/tickets/clientes', validateBody(schemaListaSorteoCliente), obtenerTodosSorteosId);

router.get('/lista/tipos/pagos', obtenerTipoPagos);

module.exports = router;