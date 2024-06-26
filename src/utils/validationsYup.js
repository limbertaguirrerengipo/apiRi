const  yup =  require('yup');
const jsonValidacionLogin = {
    usuario: yup.string().min(3).required(),
    password: yup.string().min(3).required()
};
const schemaValidarLogin = yup.object(jsonValidacionLogin);
const jsonValidacionRegistroSorteo = {
    titulo: yup.string().required(),
    cantidadTicket: yup.number().integer().positive().required(),
    precioUnitario: yup.number().positive().required(),
    idMoneda: yup.number().integer().positive().required(),
    descripcion: yup.string().required(),
    usuario: yup.string().required(),
};
const schemaValidarRegistroSorteo = yup.object(jsonValidacionRegistroSorteo);
const jsonValidacionActualizarSorteo = {
    idSorteo: yup.number().integer().positive().required(),
    cantidadTicket: yup.number().integer().positive().required(),
    estado: yup.number().integer().positive().required(),
    usuario: yup.string().required(),
};
 const schemaValidarActualizarSorteo = yup.object(jsonValidacionActualizarSorteo);
 const jsonValidacionEliminarSorteo = {
    idSorteo: yup.number().integer().positive().required(),
    usuario: yup.string().required(),
 };
const schemaEliminarSorteo = yup.object(jsonValidacionEliminarSorteo);
const jsonValidacionListadoSorteoByFecha = {
    fechaInicio: yup.date().required(),
    fechaFin: yup.date().required()
};
const schemaListadoSorteoByFecha = yup.object(jsonValidacionListadoSorteoByFecha);

const jsonValidacionDetalleSorteoId = {
    idSorteo: yup.string().required()
};
const schemaDetalleSorteoID = yup.object(jsonValidacionDetalleSorteoId);

const jsonValidacionTicketSorteo = {
    idSorteo:yup.string().required(),
    carnetIdentidad: yup.string().required(),
    cantidadTicket: yup.number().integer().positive().required(),
    nombreCompleto: yup.string().required(),
    codePais: yup.string().required(),
    nroCelular: yup.number().integer().positive().required(),
    correo: yup.string(),
    idTipoPago:yup.number().integer().positive().required(),
    lugarParticipa: yup.string().required(),
 };

 const schemaTicketSorteo = yup.object(jsonValidacionTicketSorteo);

 const jsonValidacionDetalleTickets = {
    idSorteo: yup.number().integer().positive().required(),
    idEstadoPago:yup.number().integer().required()
 };
 const schemaDetalleTickets = yup.object(jsonValidacionDetalleTickets);

 const jsonValidacionDetalleClienteSorteo = {
    idSorteo: yup.number().integer().positive().required()
 };
 const schemaDetalleClienteSorteo = yup.object(jsonValidacionDetalleClienteSorteo);

 const jsonValidacionListaDetalleCliente = {
    idSorteo: yup.number().integer().positive().required(),
    idClienteTemporal: yup.number().integer().positive().required()
 };
 const schemaDetalleCliente = yup.object(jsonValidacionListaDetalleCliente);

 const jsonValidacionEliminarTicketCliente = {
   idTicketSorteo: yup.number().integer().positive().required(),
   idClienteTemporal: yup.number().integer().positive().required(),
   usuario: yup.string()
 };
 const schemaEliminarCliente = yup.object(jsonValidacionEliminarTicketCliente);

 const jsonValidacionListSorteoClientes = {
    idSorteo: yup.number().integer().positive().required()
 };
 const schemaListaSorteoCliente = yup.object(jsonValidacionListSorteoClientes);

 module.exports = {
    schemaValidarLogin,
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
 }