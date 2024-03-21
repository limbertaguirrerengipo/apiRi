
const queryObtenerSorteosPorfecha =({estadoActivo, estadoInactivo, fechaInicio, fechaFin})=>{
    return `SELECT 
    s.idSorteo, 
    s.titulo,
    s.cantidadTicket,
    s.precioUnitario,
    s.fechaSorteo,
    s.idMoneda,
    s.descripcion,
    s.estado
    from bdRifa.dbo.sorteo s
    where 
    s.estado IN (${estadoActivo}, ${estadoInactivo}) AND 
    s.fechaCreacion BETWEEN ${fechaInicio} AND  ${fechaFin} `;

}
const queryObtenerTicketsBySorteo =({idSorteo})=>{
    return `SELECT
    TS.idTicketSorteo,
    TS.idSorteo,
    Cl.idClienteTemporal,
    Cl.nombreCompleto,
    Cl.carnetIdentidad,
    Cl.codePais,
    Cl.nroCelular,
    Cl.correo,
    TS.monto,
    S.idMoneda,
    TS.idTipoPago,
    TS.idEstadoPago
   FROM TicketSorteo TS 
  INNER JOIN ClienteTemporal Cl on CL.idClienteTemporal = TS.idClienteTemporal
  INNER JOIN Sorteo S on S.idSorteo = TS.idSorteo
   where TS.idEstadoPago in (1,2) and TS.idSorteo = ${idSorteo} `;
}

module.exports = {
    queryObtenerSorteosPorfecha,
    queryObtenerTicketsBySorteo
}