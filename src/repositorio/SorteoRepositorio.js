const dbAdministrativoFlujoConection = require('../models/dbRifa/dbAdministrativoFlujoConection');
const {SorteoModel} = require('../models/dbRifa/SorteoModel');
const { TipoPagoModel } = require('../models/dbRifa/TipoPagoModel');
const {SorteoImagenesModel} = require('../models/dbRifa/SorteoImagenesModel');
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
const obtenerDetalleClienteXSorteoId = async({idSorteo},{transaction=null}) => {
    try {

        const sql = `SELECT 
                            DISTINCT c.idClienteTemporal,
                            c.nombreCompleto,
                            c.carnetIdentidad,
                            c.codePais,
                            c.nroCelular as celular,
                            s.idMoneda,
                            c.montoTotal as total,
                            s.idSorteo,
                            c.idTipoPago,
                            c.fechaCreacion,
                            (SELECT nombre FROM bdRifa.dbo.TipoPago where idTipoPago =c.idTipoPago) as tipoPago,
                            (select COUNT(*) from TicketSorteo f where f.idEstadoPago in (${ESTADO_PAGO.APLICADO}, ${ESTADO_PAGO.PENDIENTE}) and f.idClienteTemporal= c.idClienteTemporal and f.idSorteo= s.idSorteo ) as cantidad
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



module.exports = {
    registrarSorteoRepo,
    ActualizarSorteo,
    obtenerSorteoById,
    EliminarSorteoById,
    AgregarListaImagenes,
    obtenerlistaSorteoByFecha,
    obtenerListSorteoImagenesById,
    obtenerListaTipoPagoDisponibles,
    agregarListTicketsSorteoMasivo,
    obtenerCantidadSorteosRegistrados,
    obtenerDetalleTicketByIdStatus,
    obtenerDetalleClienteXSorteoId
}