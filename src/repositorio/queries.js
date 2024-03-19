const queryObtenerFuncionarios = ({idEmpleados}) => {
    return `select codfuncionario, nombreEmpleado as nombre, empresa1.nombre as empresa, nombreArea, nombreCargo, ci, idempleado, idarea, idcargo
    from bd_pedidobkp.dbo.Funcionarios
            left join bd_pedidobkp.dbo.Empresa_alias as empresa1 on IdEmpresa = empresa1.id
    where idempleado in (${idEmpleados})`;
}
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

module.exports = {
    queryObtenerFuncionarios,
    queryObtenerSorteosPorfecha
}