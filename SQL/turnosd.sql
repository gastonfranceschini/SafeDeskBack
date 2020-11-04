-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: turnosd
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `diagnosticos`
--

DROP TABLE IF EXISTS `diagnosticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnosticos` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdUsuario` int(11) NOT NULL,
  `Temperatura` float DEFAULT NULL,
  `PerdioGusto` bit(1) DEFAULT NULL,
  `ContactoCercano` bit(1) DEFAULT NULL,
  `EstoyEmbarazada` bit(1) DEFAULT NULL,
  `Cancer` bit(1) DEFAULT NULL,
  `Diabetes` bit(1) DEFAULT NULL,
  `Hepatica` bit(1) DEFAULT NULL,
  `PerdioOlfato` bit(1) DEFAULT NULL,
  `DolorGarganta` bit(1) DEFAULT NULL,
  `DificultadRespiratoria` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_DIAGNOSTICO_USUARIO_idx` (`IdUsuario`),
  CONSTRAINT `FK_DIAGNOSTICO_USUARIO` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`DNI`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnosticos`
--

LOCK TABLES `diagnosticos` WRITE;
/*!40000 ALTER TABLE `diagnosticos` DISABLE KEYS */;
INSERT INTO `diagnosticos` VALUES (1,101,37,_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(2,101,38,_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(3,101,37.5,_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(4,105,36.9,_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(5,105,37.1,_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0'),(6,102,39,_binary '',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '\0',_binary '',_binary '',_binary '');
/*!40000 ALTER TABLE `diagnosticos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `edificios`
--

DROP TABLE IF EXISTS `edificios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `edificios` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Direccion` varchar(250) DEFAULT NULL,
  `Lat` varchar(45) DEFAULT NULL,
  `Long` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `edificios`
--

LOCK TABLES `edificios` WRITE;
/*!40000 ALTER TABLE `edificios` DISABLE KEYS */;
INSERT INTO `edificios` VALUES (1,'Ibera','Libertador 6900','30.00','30.00'),(2,'Cavallito','Av. La Plata 1100','60.00','60.00');
/*!40000 ALTER TABLE `edificios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gerencias`
--

DROP TABLE IF EXISTS `gerencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gerencias` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gerencias`
--

LOCK TABLES `gerencias` WRITE;
/*!40000 ALTER TABLE `gerencias` DISABLE KEYS */;
INSERT INTO `gerencias` VALUES (1,'Sistemas'),(2,'Diseño'),(3,'Adornos'),(4,'RRHH'),(5,'Liquidaciones');
/*!40000 ALTER TABLE `gerencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horariosentrada`
--

DROP TABLE IF EXISTS `horariosentrada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horariosentrada` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Horario` varchar(45) NOT NULL,
  `Cupo` int(11) NOT NULL,
  `IdEdificio` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_HE_Edificios_idx` (`IdEdificio`),
  CONSTRAINT `FK_HE_Edificios` FOREIGN KEY (`IdEdificio`) REFERENCES `edificios` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horariosentrada`
--

LOCK TABLES `horariosentrada` WRITE;
/*!40000 ALTER TABLE `horariosentrada` DISABLE KEYS */;
INSERT INTO `horariosentrada` VALUES (1,'8:00',5,1),(2,'8:10',5,1),(3,'8:20',5,1),(4,'8:30',5,1),(5,'8:40',5,1),(6,'8:50',5,1),(7,'9:00',5,1),(8,'8:00',5,2),(9,'8:00',5,2),(10,'8:10',5,2),(11,'8:20',5,2),(12,'8:30',5,2),(13,'8:40',5,2),(14,'8:50',5,2);
/*!40000 ALTER TABLE `horariosentrada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pisos`
--

DROP TABLE IF EXISTS `pisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pisos` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Numero` int(11) NOT NULL,
  `IdEdificio` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Pisos_Edificios_idx` (`IdEdificio`),
  CONSTRAINT `FK_Pisos_Edificios` FOREIGN KEY (`IdEdificio`) REFERENCES `edificios` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pisos`
--

LOCK TABLES `pisos` WRITE;
/*!40000 ALTER TABLE `pisos` DISABLE KEYS */;
INSERT INTO `pisos` VALUES (1,'Piso 1',1,1),(2,'Piso 2',2,1),(3,'Piso 3',3,1),(4,'Piso 4',4,1),(5,'Piso 5',5,1),(6,'Piso 1',1,2),(7,'Piso 2',2,2),(8,'Piso 3',3,2),(9,'Piso 4',4,2),(10,'Piso 5',5,2),(11,'Piso 6',6,2);
/*!40000 ALTER TABLE `pisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pisosxgerencias`
--

DROP TABLE IF EXISTS `pisosxgerencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pisosxgerencias` (
  `Id` int(11) NOT NULL,
  `IdPiso` int(11) NOT NULL,
  `IdGerencia` int(11) NOT NULL,
  `Cupo` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id`),
  KEY `FK_PXG_Pisos_idx` (`IdPiso`),
  KEY `FK_PXG_Gerencia_idx` (`IdGerencia`),
  CONSTRAINT `FK_PXG_Gerencia` FOREIGN KEY (`IdGerencia`) REFERENCES `gerencias` (`Id`),
  CONSTRAINT `FK_PXG_Piso` FOREIGN KEY (`IdPiso`) REFERENCES `pisos` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pisosxgerencias`
--

LOCK TABLES `pisosxgerencias` WRITE;
/*!40000 ALTER TABLE `pisosxgerencias` DISABLE KEYS */;
INSERT INTO `pisosxgerencias` VALUES (1,1,1,5),(2,1,2,10),(3,2,1,15),(4,3,1,13),(5,4,2,14),(6,5,1,5),(7,5,2,5),(8,6,3,10),(9,7,3,5),(10,7,2,5),(11,8,1,13),(12,9,1,17);
/*!40000 ALTER TABLE `pisosxgerencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiposdeusuario`
--

DROP TABLE IF EXISTS `tiposdeusuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiposdeusuario` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tipos de usuarios';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiposdeusuario`
--

LOCK TABLES `tiposdeusuario` WRITE;
/*!40000 ALTER TABLE `tiposdeusuario` DISABLE KEYS */;
INSERT INTO `tiposdeusuario` VALUES (1,'OPERADOR'),(2,'SUPERVISOR'),(3,'GERENTE'),(4,'ADMINISTRADOR'),(5,'SEGURIDAD'),(6,'OTRO');
/*!40000 ALTER TABLE `tiposdeusuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos`
--

DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdUsuario` int(11) NOT NULL,
  `IdUsuarioPedido` int(11) NOT NULL,
  `FechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FechaTurno` datetime NOT NULL,
  `IdHorarioEntrada` int(11) NOT NULL,
  `IdPisoXGerencia` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Turnos_Usuario_idx` (`IdUsuario`),
  KEY `FK_Turnos_Usuario_ped_idx` (`IdUsuarioPedido`),
  KEY `FK_Turnos_HorarioEntrada_idx` (`IdHorarioEntrada`),
  KEY `FK_Turnos_PXG_idx` (`IdPisoXGerencia`),
  CONSTRAINT `FK_Turnos_HorarioEntrada` FOREIGN KEY (`IdHorarioEntrada`) REFERENCES `horariosentrada` (`Id`),
  CONSTRAINT `FK_Turnos_PXG` FOREIGN KEY (`IdPisoXGerencia`) REFERENCES `pisosxgerencias` (`Id`),
  CONSTRAINT `FK_Turnos_Usuario` FOREIGN KEY (`IdUsuario`) REFERENCES `usuarios` (`DNI`),
  CONSTRAINT `FK_Turnos_Usuario_ped` FOREIGN KEY (`IdUsuarioPedido`) REFERENCES `usuarios` (`DNI`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos`
--

LOCK TABLES `turnos` WRITE;
/*!40000 ALTER TABLE `turnos` DISABLE KEYS */;
INSERT INTO `turnos` VALUES (1,100,100,'2020-09-21 22:58:24','2020-09-21 00:00:00',1,1),(2,101,101,'2020-09-30 20:58:24','2020-10-05 00:00:00',2,3),(3,102,100,'2020-09-30 00:00:00','2020-10-05 00:00:00',2,3);
/*!40000 ALTER TABLE `turnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `DNI` int(11) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Nombre` varchar(500) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `IdTipoDeUsuario` int(11) NOT NULL,
  `IdGerencia` int(11) DEFAULT NULL,
  `IdJefeDirecto` int(11) DEFAULT NULL,
  PRIMARY KEY (`DNI`),
  KEY `_idx` (`IdTipoDeUsuario`),
  KEY `FK_Usuarios_Gerencias_idx` (`IdGerencia`),
  KEY `FK_Usuarios_Usuarios_Jefe_idx` (`IdJefeDirecto`),
  CONSTRAINT `FK_Usuarios_Gerencias` FOREIGN KEY (`IdGerencia`) REFERENCES `gerencias` (`Id`),
  CONSTRAINT `FK_Usuarios_TiposDeUsuario` FOREIGN KEY (`IdTipoDeUsuario`) REFERENCES `tiposdeusuario` (`Id`),
  CONSTRAINT `FK_Usuarios_Usuarios_Jefe` FOREIGN KEY (`IdJefeDirecto`) REFERENCES `usuarios` (`DNI`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (100,'$2b$10$lcO/hkeiG09E4HBAzQWrguAuVHmOU4t3XjZZrm/tl/VVDF7a14aAi','Lucho','Luchito@gmail.com',2,1,NULL),(101,'$2b$10$zREd9CTFG/ZvmP10f0wPxuJYWQ2.78LG2Zb1OTtxD2xE3csoHz.My','Gaston','gastonaleiglesias@gmail.com',3,1,100),(102,'$2b$10$fLeb9jEdduJMHtr3BC3jz.IdMFe9OMexTEgMVZwn8l/bk3RScqlkm','Rama','rama@gmail.com',1,3,100),(103,'$2b$10$LyY0voq8QtFhspa41vCDxumjfNI4SRtEtWk6E1aQDfBtbc7aEDHyq','Gaston Franceschinni','gastonfrances@gmail.com',1,2,100),(104,'$2b$10$h5z29o59TX4KBk2ZisUaS.S1BtUZLo.nBoFYEAfBCYygqgM4qRMci','Alan','alan@gmail.com',1,2,100),(105,'$2b$10$A9HLwUVHGoOy0xVjM5tkuu/06VNZIOtcp0L2q3E5tR8hku/DDCm8S','Pablo','pablo@gmail.com',4,1,100);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-01 21:32:51

--NEW TABLES
CREATE TABLE `turnosd`.`reportes` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Query` VARCHAR(4000) NOT NULL,
  `SelGerencia` BIT(1) NULL,
  `SelUsuario` BIT(1) NULL,
  `SelFecha` BIT(1) NULL,
  `SelEdificio` BIT(1) NULL,
  `SelPiso` BIT(1) NULL,
  `SelHorario` BIT(1) NULL,
  PRIMARY KEY (`Id`));
--
  CREATE TABLE `turnosd`.`configuraciones` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NULL,
  `Valor` VARCHAR(100) NULL,
  `Descripcion` VARCHAR(1000) NULL,
  PRIMARY KEY (`Id`));


INSERT INTO `turnosd`.`configuraciones` (`Nombre`, `Valor`, `Descripcion`) VALUES ('TurnosActivo', '1', 'Activa y Desactiva los Turnos');
INSERT INTO `turnosd`.`configuraciones` (`Nombre`, `Valor`, `Descripcion`) VALUES ('HorariosActivo', '1', 'Activa los horarios');
INSERT INTO `turnosd`.`configuraciones` (`Nombre`, `Valor`) VALUES ('DiagnosticosActivo', '1');


USE `turnosd`;
DROP procedure IF EXISTS `sp_rep_turnos`;
DELIMITER $$
USE `turnosd`$$
CREATE PROCEDURE `sp_rep_turnos` (v_fecha varchar(100),v_edificio int,v_piso int,v_horario int,v_gerencia int)
BEGIN
 select t.Id TurnoId, u.DNI DNI, u.Nombre Nombre, t.FechaTurno,e.Nombre Edificio,p.Nombre Piso, he.Horario 
    from turnos t
    inner join pisosxgerencias pxg on pxg.id = IdPisoXGerencia
    INNER JOIN pisos p ON p.Id = pxg.IdPiso
    INNER JOIN edificios e ON e.Id = p.IdEdificio
    inner join usuarios u on u.DNI = t.IdUsuario
    left join horariosentrada he on he.id = IdHorarioEntrada
    where (1=1)
    and (v_fecha is null or t.FechaTurno = v_fecha)
    and (v_gerencia is null or pxg.IdGerencia = v_gerencia)
    and (v_edificio is null or e.Id = v_edificio)
	and (v_piso is null or p.Id = v_piso)
	and (v_horario is null or he.Id = v_horario)
    ;
END$$
DELIMITER ;

ALTER TABLE `turnosd`.`reportes` 
CHANGE COLUMN `SelGerencia` `SelGerencia` INT NULL DEFAULT NULL ,
CHANGE COLUMN `SelUsuario` `SelUsuario` INT NULL DEFAULT NULL ,
CHANGE COLUMN `SelFecha` `SelFecha` INT NULL DEFAULT NULL ,
CHANGE COLUMN `SelEdificio` `SelEdificio` INT NULL DEFAULT NULL ,
CHANGE COLUMN `SelPiso` `SelPiso` INT NULL DEFAULT NULL ,
CHANGE COLUMN `SelHorario` `SelHorario` INT NULL DEFAULT NULL ;


INSERT INTO `turnosd`.`reportes` 
(`Id`,`Nombre`,`Query`,`SelGerencia`,`SelUsuario`,`SelFecha`,`SelEdificio`,`SelPiso`,`SelHorario`) 
VALUES
(2,'Turnos por dia','sp_rep_turnos(\':fecha\',:edificio,:piso,:horario,:gerencia)',1,0,1,1,1,1);


/*DE TEST*/

INSERT INTO `turnosd`.`reportes` 
(`Id`,`Nombre`,`Query`,`SelGerencia`,`SelUsuario`,`SelFecha`,`SelEdificio`,`SelPiso`,`SelHorario`) 
VALUES
(3,'Casos Cercanos','sp_rep_turnos(\':fecha\',:edificio,:piso,:horario,:gerencia)',1,1,1,0,0,0);

INSERT INTO `turnosd`.`reportes` 
(`Id`,`Nombre`,`Query`,`SelGerencia`,`SelUsuario`,`SelFecha`,`SelEdificio`,`SelPiso`,`SelHorario`) 
VALUES
(4,'Turnos Fecha Mayor','sp_rep_turnos(\':fecha\',:edificio,:piso,:horario,:gerencia)',1,0,1,1,1,1);

INSERT INTO `turnosd`.`reportes` 
(`Id`,`Nombre`,`Query`,`SelGerencia`,`SelUsuario`,`SelFecha`,`SelEdificio`,`SelPiso`,`SelHorario`) 
VALUES
(5,'Turnos Fecha Menor','sp_rep_turnos(\':fecha\',:edificio,:piso,:horario,:gerencia)',1,0,1,1,1,1);

--puedo hacer gestiones directamente con un registro de la bd, que campeon!
INSERT INTO `turnosd`.`reportes` 
(`Id`,`Nombre`,`Query`,`SelGerencia`,`SelUsuario`,`SelFecha`,`SelEdificio`,`SelPiso`,`SelHorario`) 
VALUES
(6,'Desactivar Usuario','sp_rep_turnos(\':fecha\',:edificio,:piso,:horario,:gerencia)',1,0,1,1,1,1);

/*TEST DEL REPORTE
--POST a URL
http://localhost:3000/api/reportes/dinamic/2
--body
{
	"campos": ["fecha","edificio","piso","horario","gerencia"],
	"valores":  ["2020-10-19","NULL","NULL","NULL","NULL"]
}

*/