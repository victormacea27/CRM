/*** Usar BD ***/
use `crm` ;

INSERT INTO `crm`.`regiones` (`nombre`) VALUES ('Suramerica'),('Norteamerica'),('Europa');
INSERT INTO `crm`.`paises` (`nombre`,`id_region`) VALUES ('Colombia',1),('Argentina',1),('USA',2),('Canada',2),('Francia',3);
INSERT INTO `crm`.`ciudades`(`nombre`,`id_pais`) VALUES ('Medellin',1),('Bogota',1),('Buenos aires',2),('Florida',3),('Boston',3),('Toronto',4),('Paris',5);

INSERT INTO `crm`.`companias` (`nombre`,`direccion`,`email`,`telefono`,`id_ciudad`)
VALUES('Rappi','Calle 123','rappi@mail.com','123456789',1),('exito','Calle 456','exito@mail.com','987654321',2);

INSERT INTO `crm`.`contactos` (`nombre`,`apellido`,`cargo`,`email`,`id_compania`,`id_ciudad`,`direccion`,`canal`,`interes`) 
VALUES ('contacto1','UNO','Gerente','contacto1@mail.com',1,1,'Calle 123','Linkedin',100), ('contacto2','DOS','Secretaria','contacto2@mail.com',2,2,'Carrera 1234','Email',75), ('contacto3','TRES','Secretaria','contacto3@mail.com',2,2,'Carrera 123','Fabebook',50);

INSERT INTO `crm`.`usuarios` (`nombre`,`apellido`,`email`,`perfil`,`contrasena`) 
VALUES('admin','admin','admin@mail.com',1,'123456'),('vm','vm','vm@mail.com',2,'654321');