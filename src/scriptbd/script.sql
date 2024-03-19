
-- CREATE DATABASE bdRifa
go
use bdRifa

create table Sorteo(
  idSorteo int primary key identity,
  titulo varchar(50) not null,
  cantidadTicket bigint not null,
  precioUnitario decimal(12,2) not null,
  linkReservas varchar(max) not null,
  fechaSorteo datetime,
  idMoneda int, --1 bolivianos, 2 Dolares
  descripcion varchar(max),
  estado int, --1 activo. 2 inactivo, 3 eliminado,
  fechaCreacion dateTime default GetDate(),
  fechaModificacion dateTime,
  usuarioCreacion  varchar(50) not null,
  usuarioModificacion  varchar(50)
);
go
create table SorteoImagenes(
  idSorteoImagenes int primary key identity,
  idSorteo int not null,
  urlImagen varchar(200) not null,
  nombreImagen varchar(200),
  extension varchar(50) not null, -- .png , jpge, jpg
  estado bit, --true o false
  fechaCreacion dateTime default GetDate(),
  fechaModificacion dateTime,
  usuarioCreacion  varchar(50) not null,
  usuarioModificacion  varchar(50)
)
go
create table TipoPago(
  idTipoPago int primary key not null,
  nombre varchar(50) not null,
  descripcion varchar(200),
  urlImagen varchar(300),
  estado bit
)
go
create table ClienteTemporal(
  idClienteTemporal int primary key identity not null,
  carnetIdentidad varchar(200)not null,
  nombreCompleto varchar(100) not null,
  codePais varchar(30)not null,
  nroCelular varchar(50) not null,
  correo varchar(100),
  montoTotal decimal(12,2) not null,
  idTipoPago int not null,
  fechaCreacion dateTime default GetDate(),
  fechaModificacion dateTime,
  usuarioCreacion  varchar(50) not null,
  usuarioModificacion  varchar(50)
)
go
create table TicketSorteo(
  idTicketSorteo bigint primary key identity not null,
  idSorteo int not null,
  idClienteTemporal int not null,
  monto decimal(12,2) not null,
  idTipoPago int not null,   -- 1 QR, 2 credito/debito, 3 Efectivo
  idEstadoPago int not null, --1 aplicado, 2 pendiente, 3 cancelado
  fecha datetime,
  fechaCreacion dateTime default GetDate(),
  fechaModificacion dateTime,
  usuarioCreacion  varchar(50) not null,
  usuarioModificacion  varchar(50)
)
go
INSERT into TipoPago (idTipoPago, nombre, descripcion, urlImagen, estado) VALUES(1, 'PAGO QR','pago con transferencia','pagos/qr.png',1)
INSERT into TipoPago (idTipoPago, nombre, descripcion, urlImagen, estado) VALUES(2, 'CREDITO/DEBITO','Pago bancario','pagos/debito.png',1)
INSERT into TipoPago (idTipoPago, nombre, descripcion, urlImagen, estado) VALUES(3, 'EFECTIVO','pago con transferencia','pagos/efectivo.png',1)
