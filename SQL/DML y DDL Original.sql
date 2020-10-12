--DDL + DML

/*
*Tablas*
Edificios - OK
Gerencias - OK
Pisos - OK
PisosXGerencias - OK
Usuarios - OK
TiposDeUsuario - OK
Diagnosticos - OK
HorariosEntrada - OK
Turnos - OK
*Datos*
Crear Tipos de Usuario - OK
Crear Datos de Prueba de  todo el circuito - OK
*/

--pass para ingresar
--ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

/*

http://safedesk-dev.apiexperta.com.ar/
http://35.190.67.223/

*/
CREATE TABLE `turnosd`.`TiposDeUsuario` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Descripcion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`))
COMMENT = 'Tipos de usuarios';

insert into TiposDeUsuario (Descripcion) values ("OPERADOR");
insert into TiposDeUsuario (Descripcion) values ("SUPERVISOR");
insert into TiposDeUsuario (Descripcion) values ("GERENTE");
insert into TiposDeUsuario (Descripcion) values ("ADMINISTRADOR");
insert into TiposDeUsuario (Descripcion) values ("SEGURIDAD");

CREATE TABLE `turnosd`.`Usuarios` (
  `DNI` INT NOT NULL,
  `Password` VARCHAR(100) NOT NULL,
  `Nombre` VARCHAR(500) NULL,
  `Email` VARCHAR(100) NULL,
  `IdTipoDeUsuario` INT NOT NULL,
  `IdGerencia` INT NULL,
  `IdJefeDirecto` INT NULL,
  PRIMARY KEY (`DNI`),
  INDEX `_idx` (`IdTipoDeUsuario` ASC),
  CONSTRAINT `FK_Usuarios_TiposDeUsuario`
    FOREIGN KEY (`IdTipoDeUsuario`)
    REFERENCES `turnosd`.`TiposDeUsuario` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `turnosd`.`Gerencias` (
  `Id` INT NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`));


ALTER TABLE `turnosd`.`Usuarios` 
ADD INDEX `FK_Usuarios_Gerencias_idx` (`IdGerencia` ASC);
;
ALTER TABLE `turnosd`.`Usuarios` 
ADD CONSTRAINT `FK_Usuarios_Gerencias`
  FOREIGN KEY (`IdGerencia`)
  REFERENCES `turnosd`.`Gerencias` (`Id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
  
  ALTER TABLE `turnosd`.`Usuarios` 
ADD INDEX `FK_Usuarios_Usuarios_Jefe_idx` (`IdJefeDirecto` ASC);
;
ALTER TABLE `turnosd`.`Usuarios` 
ADD CONSTRAINT `FK_Usuarios_Usuarios_Jefe`
  FOREIGN KEY (`IdJefeDirecto`)
  REFERENCES `turnosd`.`Usuarios` (`DNI`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
  
  CREATE TABLE `turnosd`.`Pisos` (
  `Id` INT NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  `Numero` INT NOT NULL,
  PRIMARY KEY (`Id`));


CREATE TABLE `turnosd`.`Edificios` (
  `Id` INT NOT NULL,
  `Nombre` VARCHAR(100) NOT NULL,
  `Direccion` VARCHAR(250) NULL,
  `Lat` VARCHAR(45) NULL,
  `Long` VARCHAR(45) NULL,
  PRIMARY KEY (`Id`));


ALTER TABLE `turnosd`.`Pisos` 
ADD COLUMN `IdEdificio` INT NULL AFTER `Numero`,
ADD INDEX `FK_Pisos_Edificios_idx` (`IdEdificio` ASC);
;
ALTER TABLE `turnosd`.`Pisos` 
ADD CONSTRAINT `FK_Pisos_Edificios`
  FOREIGN KEY (`IdEdificio`)
  REFERENCES `turnosd`.`Edificios` (`Id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
  
  CREATE TABLE `turnosd`.`PisosXGerencias` (
  `Id` INT NOT NULL,
  `IdPiso` INT NOT NULL,
  `IdGerencia` INT NOT NULL,
  `Cupo` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`Id`),
  INDEX `FK_PXG_Pisos_idx` (`IdPiso` ASC),
  INDEX `FK_PXG_Gerencia_idx` (`IdGerencia` ASC),
  CONSTRAINT `FK_PXG_Piso`
    FOREIGN KEY (`IdPiso`)
    REFERENCES `turnosd`.`Pisos` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_PXG_Gerencia`
    FOREIGN KEY (`IdGerencia`)
    REFERENCES `turnosd`.`Gerencias` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


CREATE TABLE `turnosd`.`Diagnosticos` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `IdUsuario` INT NOT NULL,
  `Temperatura` FLOAT NULL,
  `PerdioGusto` BIT(1) NULL,
  `ContactoCercano` BIT(1) NULL,
  `EstoyEmbarazada` BIT(1) NULL,
  `Cancer` BIT(1) NULL,
  `Diabetes` BIT(1) NULL,
  `Hepatica` BIT(1) NULL,
  `PerdioOlfato` BIT(1) NULL,
  `DolorGarganta` BIT(1) NULL,
  `DificultadRespiratoria` BIT(1) NULL,
  PRIMARY KEY (`Id`));


ALTER TABLE `turnosd`.`Diagnosticos` 
ADD INDEX `FK_DIAGNOSTICO_USUARIO_idx` (`IdUsuario` ASC);
;
ALTER TABLE `turnosd`.`Diagnosticos` 
ADD CONSTRAINT `FK_DIAGNOSTICO_USUARIO`
  FOREIGN KEY (`IdUsuario`)
  REFERENCES `turnosd`.`Usuarios` (`DNI`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


CREATE TABLE `turnosd`.`HorariosEntrada` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Horario` VARCHAR(45) NOT NULL,
  `Cupo` INT NOT NULL,
  `IdEdificio` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `FK_HE_Edificios_idx` (`IdEdificio` ASC),
  CONSTRAINT `FK_HE_Edificios`
    FOREIGN KEY (`IdEdificio`)
    REFERENCES `turnosd`.`Edificios` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


CREATE TABLE `turnosd`.`Turnos` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `IdUsuario` INT NOT NULL,
  `IdUsuarioPedido` INT NOT NULL,
  `FechaCreacion` DATETIME NOT NULL DEFAULT NOW(),
  `FechaTurno` DATETIME NOT NULL,
  `IdHorarioEntrada` INT NOT NULL,
  `IdPisoXGerencia` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `FK_Turnos_Usuario_idx` (`IdUsuario` ASC),
  INDEX `FK_Turnos_Usuario_ped_idx` (`IdUsuarioPedido` ASC),
  INDEX `FK_Turnos_HorarioEntrada_idx` (`IdHorarioEntrada` ASC),
  INDEX `FK_Turnos_PXG_idx` (`IdPisoXGerencia` ASC),
  CONSTRAINT `FK_Turnos_Usuario`
    FOREIGN KEY (`IdUsuario`)
    REFERENCES `turnosd`.`Usuarios` (`DNI`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_Turnos_Usuario_ped`
    FOREIGN KEY (`IdUsuarioPedido`)
    REFERENCES `turnosd`.`Usuarios` (`DNI`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_Turnos_HorarioEntrada`
    FOREIGN KEY (`IdHorarioEntrada`)
    REFERENCES `turnosd`.`HorariosEntrada` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_Turnos_PXG`
    FOREIGN KEY (`IdPisoXGerencia`)
    REFERENCES `turnosd`.`PisosXGerencias` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

---- INSERTS TEST DATOS

INSERT INTO `turnosd`.`Edificios`
(`Id`,
`Nombre`,
`Direccion`,
`Lat`,
`Long`)
VALUES
(1,
'Ibera',
'Libertador 6900',
'30.00',
'30.00');


INSERT INTO `turnosd`.`Gerencias`
(`Id`,
`Nombre`)
VALUES
(1,
'Sistemas');

INSERT INTO `turnosd`.`HorariosEntrada`
(`Id`,
`Horario`,
`Cupo`,
`IdEdificio`)
VALUES
(1,
'10:00',
5,
1);

INSERT INTO `turnosd`.`Pisos`
(`Id`,
`Nombre`,
`Numero`,
`IdEdificio`)
VALUES
(1,
'Piso 1',
'1',
1);

INSERT INTO `turnosd`.`PisosXGerencias`
(`Id`,
`IdPiso`,
`IdGerencia`,
`Cupo`)
VALUES
(1,
1,
1,
5);

INSERT INTO `turnosd`.`Usuarios`
(`DNI`,
`Password`,
`Nombre`,
`Email`,
`IdTipoDeUsuario`,
`IdGerencia`)
VALUES
(100,
'100',
'Lucho',
'Luchito@gmail.com',
4,
1);


INSERT INTO `turnosd`.`Turnos`
(
`IdUsuario`,
`IdUsuarioPedido`,
`FechaTurno`,
`IdHorarioEntrada`,
`IdPisoXGerencia`)
VALUES
(
100,
100,
NOW(),
1,
1);

