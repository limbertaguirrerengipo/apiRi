const dbAdministrativoFlujoConection = require('../models/dbRifa/dbAdministrativoFlujoConection');
const {SorteoModel} = require('../models/dbRifa/SorteoModel');
const { TipoPagoModel } = require('../models/dbRifa/TipoPagoModel');
const {SorteoImagenesModel} = require('../models/dbRifa/SorteoImagenesModel');
const {SorteoImagenesCobroModel} = require('../models/dbRifa/SorteoImagenesCobroModel');
const {TicketSorteoModel} = require('../models/dbRifa/TicketSorteoModel');
const {Op, Sequelize,fn} = require('sequelize');
const queries = require('./queries');
const {ESTADO_SOLICITUD, ESTADO_PAGO, ESTADO_TIPO_PAGO}  = require('../lib/constantes');

const ejecutarQuery = async ({query, replacements, transaction = null}) => {
    try {
        console.log(`query: ${JSON.stringify(query, null, 4)}, replacements: ${JSON.stringify(replacements, null,4)}`);
        const json = {
            //criterioBusqueda: '7721912'
            ...replacements
        };
        return await dbAdministrativoFlujoConection.query(query, {
            type: 'SELECT',
            replacements: json || {},
            transaction: transaction
        });
    } catch (error) {
        console.log('error: ', error);
        throw(error);
    }
}

const registrarSorteoRepo = async ({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion, usuario},{transaction=null}) => {
    try {
        const objSort = await SorteoModel.create({
            titulo,
            cantidadTicket, 
            precioUnitario, 
            idMoneda, 
            estado:ESTADO_SOLICITUD.ACTIVO,
            descripcion,
            linkReservas:'',
            usuarioCreacion: usuario,
            fechaCreacion: fn('GETDATE'),
            // fechaModificacion: fn('GETDATE'),
            // usuarioModificacion:'admin',
        },{
             transaction,
             raw: true,
        })
        return objSort.idSorteo;
    } catch (error) {
        throw(error)
    }
}
const ActualizarSorteo = async ({idSorteo, cantidadTicket, estado,usuario},{transaction=null}) => {
    try {
        return await SorteoModel.update({
            cantidadTicket:cantidadTicket,
            estado:estado,
            usuarioModificacion:usuario,
            fechaModificacion: fn('GETDATE'),
        },{
            where: {
                idSorteo: idSorteo,
            },
            transaction: transaction
        })

    } catch (error) {
        throw(error)
    }
}
const obtenerSorteoById = async({idSorteo}) => {
    try {
        return await SorteoModel.findOne({
            where: {
                idSorteo:idSorteo,
                estado: {
                    [Op.in]: [ESTADO_SOLICITUD.ACTIVO, ESTADO_SOLICITUD.INACTIVO] 
                }
            },
            raw: true
        });
    } catch (error) {
        throw(error)
    }
}
const EliminarSorteoById = async ({idSorteo, usuario},{transaction=null}) => {
    try {
        return await SorteoModel.update({
            estado:ESTADO_SOLICITUD.ELIMINADO,
            usuarioModificacion:usuario
        },{
            where: {
                idSorteo: idSorteo,
            },
            transaction: transaction
        })

    } catch (error) {
        throw(error)
    }
}
const AgregarListaImagenes = async (listaImagenes,{transaction=null}) => {
    try {

      return await  SorteoImagenesModel.bulkCreate( listaImagenes, { transaction })

    } catch (error) {
        throw(error)
    }
}
const AgregarSorteoListaCobroQr = async (listaImagenesCobro,{transaction=null}) => {
    try {

      return await  SorteoImagenesCobroModel.bulkCreate( listaImagenesCobro, { transaction })

    } catch (error) {
        throw(error)
    }
}
const obtenerlistaSorteoByFecha = async({fechaInicio, fechaFin},{transaction=null}) => {
    try {

        const sql = `SELECT 
                        s.idSorteo, 
                        s.titulo,
                        s.cantidadTicket,
                        s.precioUnitario,
                        s.fechaSorteo,
                        s.idMoneda,
                        s.descripcion,
                        (SELECT COUNT(*)  FROM TicketSorteo tk where tk.idSorteo= s.idSorteo and tk.idEstadoPago in(${ESTADO_SOLICITUD.ACTIVO}, ${ESTADO_SOLICITUD.INACTIVO})) as cantidadReservados,
                        s.estado,
                        CONVERT(varchar(10), s.fechaCreacion, 105) + ' ' + CONVERT(varchar(8), s.fechaCreacion, 108) AS fechaRegistro
                        from Sorteo s
                        where 
                        s.estado IN ( :estadoActivo, :estadoInactvo ) AND 
                        s.fechaCreacion BETWEEN :fechaInicio AND  :fechaFin`;
                    const jsonConfiguration = {
                        type: 'SELECT',
                        replacements: {
                        fechaInicio: fechaInicio,
                        fechaFin: fechaFin,
                        estadoActivo: ESTADO_SOLICITUD.ACTIVO,
                        estadoInactvo: ESTADO_SOLICITUD.INACTIVO
                    }
                    };
                 const lista = await  dbAdministrativoFlujoConection.query(sql, jsonConfiguration);
                 return lista;

    } catch (error) {
        throw(error)
    }
}
const obtenerListSorteoImagenesById = async({idSorteo, urlServer},{transaction=null}) => {
    try {
        const urlServidorString = `'${urlServer}'` + '+I.urlImagen' 
        const sql = `SELECT
            ${urlServidorString} as urlImagen,
            I.nombreImagen
           from SorteoImagenes I where I.idSorteo= :idSorteo`;
                    const jsonConfiguration = {
                        type: 'SELECT',
                        replacements: {
                        idSorteo: idSorteo
                    }
                    };
                 const lista = await  dbAdministrativoFlujoConection.query(sql, jsonConfiguration);
                 return lista;
    } catch (error) {
        throw(error)
    }
}
const obtenerImagenQrSorteosTiposPagosXSorteoId = async({idSorteo, urlServer},{transaction=null}) => {
    try {
        const urlServidorString = `'${urlServer}'` + '+I.urlImagen' 
        const sql = `SELECT
            I.idSorteoImagenesCobro,
            ${urlServidorString} as urlImagen,
            I.extension,
            I.idTipoPago
           from SorteoImagenesCobro I where I.idSorteo= :idSorteo`;
                    const jsonConfiguration = {
                        type: 'SELECT',
                        replacements: {
                        idSorteo: idSorteo
                    }
                    };
                 const lista = await  dbAdministrativoFlujoConection.query(sql, jsonConfiguration);
                 return lista;
    } catch (error) {
        throw(error)
    }
}
const obtenerListaTipoPagoDisponibles = async({urlServerImage},{transaction=null}) => {
    try {
        const urlServidorString = `'${urlServerImage}'` + '+t.urlImagen' 
        const sql = `
            select 
                t.idTipoPago,
                t.nombre,
                t.descripcion,
                ${urlServidorString} as urlImagen
                from TipoPago t 
                where estado = 'true' `;
                    const jsonConfiguration = {
                        type: 'SELECT',
                        replacements: {
                    }
                    };
                 const lista = await  dbAdministrativoFlujoConection.query(sql, jsonConfiguration);
                 return lista;
    } catch (error) {
        throw(error)
    }
}
const agregarListTicketsSorteoMasivo = async (listTicketsSorteo,{transaction=null}) => {
    try {

      const list = await  TicketSorteoModel.bulkCreate(listTicketsSorteo, { transaction })
      return list;

    } catch (error) {
        throw(error)
    }
}

const obtenerCantidadSorteosRegistrados = async({idSorteo}) => {
    try {
        return await TicketSorteoModel.findAll({
            where: {
                idSorteo:idSorteo,
                idEstadoPago: {
                    [Op.in]: [ESTADO_PAGO.APLICADO, ESTADO_PAGO.PENDIENTE] 
                }
            },
            raw: true
        });
    } catch (error) {
        throw(error)
    }
}
const obtenerDetalleTicketByIdStatus = async({idSorteo},{transaction=null}) => {
    try {

        const sql = queries.queryObtenerTicketsBySorteo({idSorteo}); 
                    const jsonConfiguration = {
                        type: 'SELECT',
                        replacements: {
       
                    }
                    };
                 const lista = await  dbAdministrativoFlujoConection.query(sql, jsonConfiguration);
                 return lista;

    } catch (error) {
        throw(error)
    }
}
const obtenerDetalleClienteXSorteoId = async({idSorteo, urlServer},{transaction=null}) => {
    try {
        const urlServidorString = `'${urlServer}'` + '+c.urlImagen' 
        const sql = `SELECT 
                            DISTINCT c.idClienteTemporal,
                            c.nombreCompleto,
                            CASE 
                                WHEN c.urlImagen IS NULL THEN c.urlImagen
                                ELSE  ${urlServidorString}
                            END AS urlImagen,
                            c.extImagen,
                            c.carnetIdentidad,
                            c.codePais,
                            c.nroCelular as celular,
                            s.idMoneda,
                            c.montoTotal as total,
                            s.idSorteo,
                            c.idTipoPago,
                            CONVERT(varchar(10), c.fechaCreacion, 105) + ' ' + CONVERT(varchar(8), c.fechaCreacion, 108) AS fechaRegistro,
                            (SELECT nombre FROM bdRifa.dbo.TipoPago where idTipoPago =c.idTipoPago) as tipoPago,
                            (select COUNT(*) from TicketSorteo f where f.idEstadoPago in (${ESTADO_PAGO.APLICADO}, ${ESTADO_PAGO.PENDIENTE}) and f.idClienteTemporal= c.idClienteTemporal and f.idSorteo= s.idSorteo ) as cantidad,
                            (select COUNT(*) from TicketSorteo f where f.idEstadoPago in (${ESTADO_PAGO.APLICADO}) and f.idClienteTemporal= c.idClienteTemporal and f.idSorteo= s.idSorteo ) as cantidadPagados
                        FROM TicketSorteo dt 
                        INNER join Sorteo s on s.idSorteo = dt.idSorteo
                        INNER JOIN ClienteTemporal c on c.idClienteTemporal=dt.idClienteTemporal
                        WHERE s.idSorteo =${idSorteo}`;
                    const jsonConfiguration = {
                        type: 'SELECT',
                        replacements: {
                    }
                    };
                 const lista = await  dbAdministrativoFlujoConection.query(sql, jsonConfiguration);
                 return lista;

    } catch (error) {
        throw(error)
    }
}

const obtenerDetalleSorteoClienteId = async({idSorteo, idClienteTemporal},{transaction=null}) => {
    try {

        const sql = `SELECT 
        CAST(tk.idTicketSorteo AS INT) as idTicketSorteo,
        tk.idSorteo,
        tk.idClienteTemporal,
        tk.monto,
        s.idMoneda,
        tk.idEstadoPago
        FROM bdRifa.dbo.TicketSorteo tk
        INNER JOIN bdRifa.dbo.Sorteo s on s.idSorteo= tk.idSorteo
        where tk.idEstadoPago in (${ESTADO_PAGO.APLICADO}, ${ESTADO_PAGO.PENDIENTE}) and 
        tk.idSorteo=${idSorteo}  and tk.idClienteTemporal=${idClienteTemporal}`;
                    const jsonConfiguration = {
                        type: 'SELECT',
                        replacements: {
                    }
                    };
                 const lista = await  dbAdministrativoFlujoConection.query(sql, jsonConfiguration);
                 return lista;

    } catch (error) {
        throw(error)
    }
}
const TicketSorteoClienteXIds = async ({idTicketSorteo,idClienteTemporal,idEstadoPago}, usuario, {transaction=null}) => {
    try {
        return await TicketSorteoModel.update({
            idEstadoPago: idEstadoPago,
            usuarioModificacion: usuario
        },{
            where: {
                idClienteTemporal: idClienteTemporal,
                idTicketSorteo:idTicketSorteo
            },
            transaction: transaction
        })

    } catch (error) {
        throw(error)
    }
}
const eliminarTicketClienteIDS = async ({idTicketSorteo,idClienteTemporal}, usuario, {transaction=null}) => {
    try {
        return await TicketSorteoModel.update({
            idEstadoPago: ESTADO_PAGO.ELIMINADO,
            usuarioModificacion: usuario,
            fechaModificacion: fn('GETDATE')
        },{
            where: {
                idClienteTemporal: idClienteTemporal,
                idTicketSorteo:idTicketSorteo
            },
            transaction: transaction
        })

    } catch (error) {
        throw(error)
    }
}
const obtenerTodosTicketsSorteoId = async({idSorteo},{transaction=null}) => {
    try {

        const sql = `SELECT 
                            dt.idTicketSorteo,
                            c.idClienteTemporal,
                            c.nombreCompleto,
                            dt.idTicketSorteo as idTicket,
                            c.carnetIdentidad,
                            c.codePais,
                            c.nroCelular as celular,
                            (SELECT nombre FROM EstadoPago where idEstadoPago = dt.idEstadoPago) as estadoPago,
                            CONVERT(varchar(10), c.fechaCreacion, 105) + ' ' + CONVERT(varchar(8), c.fechaCreacion, 108) AS fechaRegistro,
                            s.idSorteo
                        FROM TicketSorteo dt 
                        INNER join Sorteo s on s.idSorteo = dt.idSorteo
                        INNER JOIN ClienteTemporal c on c.idClienteTemporal=dt.idClienteTemporal
                        WHERE  dt.idEstadoPago in (${ESTADO_PAGO.APLICADO}, ${ESTADO_PAGO.PENDIENTE}) and s.idSorteo =${idSorteo}
                        `;
                    const jsonConfiguration = {
                        type: 'SELECT',
                        replacements: {

                    }
                    };
                 const lista = await  dbAdministrativoFlujoConection.query(sql, jsonConfiguration);
                 return lista;

    } catch (error) {
        throw(error)
    }
}

module.exports = {
    registrarSorteoRepo,
    ActualizarSorteo,
    obtenerSorteoById,
    EliminarSorteoById,
    AgregarListaImagenes,
    obtenerlistaSorteoByFecha,
    obtenerListSorteoImagenesById,
    obtenerImagenQrSorteosTiposPagosXSorteoId,
    obtenerListaTipoPagoDisponibles,
    agregarListTicketsSorteoMasivo,
    obtenerCantidadSorteosRegistrados,
    obtenerDetalleTicketByIdStatus,
    obtenerDetalleClienteXSorteoId,
    obtenerDetalleSorteoClienteId,
    TicketSorteoClienteXIds,
    eliminarTicketClienteIDS,
    obtenerTodosTicketsSorteoId,
    AgregarSorteoListaCobroQr
}