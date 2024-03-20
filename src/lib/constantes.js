 const ESTADO_SOLICITUD = {
    ACTIVO : 1,
    INACTIVO : 2,
    ELIMINADO:3
};
const MONEDA = {
    BOLIVIANO : 1,
    DOLARES : 2
};
const ESTADO_PAGO = {
    APLICADO:1,
    PENDIENTE:2,
    ELIMINADO:3
};
const TIPO_PAGO = {
    PAGOQR:1,
    CREDITODEBITO:2,
    EFECTIVO:3
}
module.exports = {
    ESTADO_SOLICITUD,
    MONEDA,
    ESTADO_PAGO,
    TIPO_PAGO
};