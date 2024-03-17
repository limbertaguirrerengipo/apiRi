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
 module.exports = {
    schemaValidarLogin,
    schemaValidarRegistroSorteo,
    schemaValidarActualizarSorteo,
    schemaEliminarSorteo
 }