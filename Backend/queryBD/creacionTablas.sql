/*** Usar BD ***/
use `crm` ;

/*** Tabla regiones ***/
  CREATE TABLE `crm`.`regiones` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nombre` VARCHAR(30) NOT NULL,
	PRIMARY KEY (`id`)
);

/*** Tabla paises ***/
CREATE TABLE `crm`.`paises` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `id_region` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_paises_region_idx` (`id_region` ASC) VISIBLE,
  CONSTRAINT `fk_paises_region`
    FOREIGN KEY (`id_region`)
    REFERENCES `crm`.`regiones` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

/*** Tabla ciudades ***/
CREATE TABLE `crm`.`ciudades` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `id_pais` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_ciudad_pais_idx` (`id_pais` ASC) VISIBLE,
  CONSTRAINT `fk_ciudad_pais`
    FOREIGN KEY (`id_pais`)
    REFERENCES `crm`.`paises` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


/*** Tabla companias ***/
CREATE TABLE `crm`.`companias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `direccion` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `telefono` varchar(45) NOT NULL,
  `id_ciudad` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_compania_ciudad_idx` (`id_ciudad`),
  CONSTRAINT `fk_compania_ciudad` FOREIGN KEY (`id_ciudad`) REFERENCES `crm`.`ciudades` (`id`)
);


/*** Tabla contactos ***/
CREATE TABLE `crm`.`contactos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `cargo` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `id_compania` int NOT NULL,
  `id_ciudad` int NOT NULL,
  `canal` varchar(45) DEFAULT NULL,
  `interes` int DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_contactos_compania_idx` (`id_compania`),
  KEY `fk_contactos_pais_idx` (`id_ciudad`),
  CONSTRAINT `fk_contactos_compania` FOREIGN KEY (`id_compania`) REFERENCES `crm`.`companias` (`id`),
  CONSTRAINT `fk_contactos_pais` FOREIGN KEY (`id_ciudad`) REFERENCES `crm`.`ciudades` (`id`)
);


/*** Tabla usuarios ***/
CREATE TABLE `crm`.`usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `perfil` int NOT NULL,
  `contrasena` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ;
