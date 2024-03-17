const queryObtenerFuncionarios = ({idEmpleados}) => {
    return `select codfuncionario, nombreEmpleado as nombre, empresa1.nombre as empresa, nombreArea, nombreCargo, ci, idempleado, idarea, idcargo
    from bd_pedidobkp.dbo.Funcionarios
            left join bd_pedidobkp.dbo.Empresa_alias as empresa1 on IdEmpresa = empresa1.id
    where idempleado in (${idEmpleados})`;
}

module.exports = {
    queryObtenerFuncionarios,
    queryIdAreaPorIdProcesoIdArea: `select idArea from EstadoProcesoDetalle where IdProceso =:idProceso and IdEstadoProceso =:idEstadoProceso`

}