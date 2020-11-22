const express = require('express');
const app = express();
app.use(express.json());


const jwt = require('jsonwebtoken');
const secret = 'WoaOs41E_y~6'

const sequelize = require('./conexion.js');

const validaciones = require('./middlewares/validaciones.js');
const validacionesCompania = require('./middlewares/companias.js');
const validacionescontacto = require('./middlewares/contactos.js');

const validacionesToken = require('./middlewares/validaciones.js');

const queryUsuarios = require('./script/usuarios.js');
const queryRegion = require('./script/region.js');
const queryPais = require('./script/pais.js');
const queryCiudad = require('./script/ciudades.js');
const queryCompania = require('./script/companias.js');
const queryContacto = require('./script/contactos.js');


//Conexion front
const helmet = require('helmet');
app.use(helmet.permittedCrossDomainPolicies({permittedPolicies: "by-content-type"}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE" );
    next();
});

////////////////////////////////////////////////USUARIO///////////////////////////////////////////////////////

//Buscar todos los usuarios
app.get('/usuarios', (req,res)=>{
    sequelize.query("SELECT * FROM crm.usuarios;",
    {
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});

//Buscar todos un usuario
app.get('/usuariosBuscar', (req,res)=>{
    sequelize.query("SELECT * FROM crm.usuarios where id = ?;",
    {   replacements:[req.query.id],
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});

// Ingresar usuario
app.post('/login', validacionesToken.validarLogin, async (req,res)=>{
    try {
        //Buscar usuario por usuario
        //console.log(req.body);
        const usuario = await queryUsuarios.BuscarUsuarioPorUsuario(req.body);
        //console.log(usuario);
        const contrasena = req.body.contrasena;
        //Si no lo encuentra length es 0
        if (!usuario.length) {
        return res.status(401).json("error: Usuario no encontrado o registrado");
        }
        //console.log(usuario[0].contrasena);
        //console.log(contrasena);
        //Generar token
        if (usuario[0].contrasena == contrasena) {
            console.log('Entro al pyload');
            console.log(secret);
            const payload = {
              id: usuario[0].id,
              email: usuario[0].email,
              nombre_completo: usuario[0].nombre,
              perfil: usuario[0].perfil
            }
            const token = jwt.sign(payload, secret);
            //console.log(payload);
            //console.log(token);
            return res.header("auth-token", token).json(token);
            //res.status(200).json({token});
          }else {
              //Contraseña incorrecta
                return res.status(404).json("error: Contraseña incorrecta valida los datos e ingresa nuevamente");
          }
    } catch (error) {
        res.status(401).json("error: Usuario no encontrado o registrado ");
      }
});

//Crear Usuario
app.post('/crearUsuario',validaciones.validarDatosUsuario, async (req,res)=>{
    const usuario = await queryUsuarios.BuscarUsuarioPorEmail(req.body);
    console.log('Valido usuario');
    if (usuario.length) {
        return res.status(405).json( "error: El usuario ya existe" );
    }
    sequelize.query("INSERT INTO `crm`.`usuarios` (`nombre`,`apellido`,`email`,`perfil`,`contrasena`) VALUES(?,?,?,?,?);",
    {
        replacements:[req.body.nombre,req.body.apellido,req.body.email,req.body.perfil,req.body.contrasena],
        type: sequelize.QueryTypes.INSERT
    }).then(result =>{
        res.status(200).json('Usuario Creado');
        console.log(result);
    }).catch(err=>{
        res.status(500).json(err);
    })
 });

 //Crear Usuario
app.post('/crearUsuarioNuevo',validaciones.validarDatosUsuario, async (req,res)=>{
    const usuario = await queryUsuarios.BuscarUsuarioPorEmail(req.body);
    console.log('Valido usuario  nuevo');
    if (usuario.length) {
        return res.status(405).json( "error: El usuario ya existe" );
    }
    sequelize.query("INSERT INTO `crm`.`usuarios` (`nombre`,`apellido`,`email`,`perfil`,`contrasena`) VALUES(?,?,?,?,?);",
    {
        replacements:[req.body.nombre,req.body.apellido,req.body.email,req.body.perfil,req.body.contrasena],
        type: sequelize.QueryTypes.INSERT
    }).then(result =>{
        res.status(200).json('Usuario Creado');
        console.log(result);
    }).catch(err=>{
        res.status(500).json(err);
    })
 });

//Modificar usuario
//localhost:7000/modificarUsuario?id_producto=
app.put('/modificarUsuario',validaciones.validarDatosUsuario, async (req,res)=>{
    const usuarioExiste = await queryUsuarios.BuscarUsuarioPorID(req.query.id_usuario);
    //console.log(usuarioExiste.length);
    console.log(usuarioExiste);
    if (usuarioExiste.length) {
        sequelize.query("UPDATE `crm`.`usuarios` SET `nombre` = ?, `apellido` = ?, `email` = ?, `perfil` = ?, `contrasena` = ? WHERE `id` = ?;",
        {
            replacements:[req.body.nombre,req.body.apellido,req.body.email,req.body.perfil,req.body.contrasena,req.query.id_usuario],
            type: sequelize.QueryTypes.UPDATE
        }).then(result =>{
            res.status(200).json('usuario: modificado');
        }).catch(err=>{
            res.status(500).json(err);
        })
    } else{
        return res.status(404).json({ error: 'El usuario no existe, valida que este logueado' });
    }
 });

//Eliminar usuario
app.delete('/eliminarUsuario', async(req,res)=>{
    const usuarioExiste = await queryUsuarios.BuscarUsuarioPorID(req.query.id);
    console.log(usuarioExiste.length);
    if (usuarioExiste.length) {
        sequelize.query("DELETE FROM `crm`.`usuarios` WHERE id = ?;",
        {
            replacements:[req.query.id],
            type: sequelize.QueryTypes.DELETE
        }).then(result =>{
            res.status(200).json('id del usuario eliminado: ' + req.query.id);
        }).catch(err=>{
            res.status(500).json(err);
        })
    }else{
        return res.status(404).json({ error: 'El usuario no existe, valida que este logueado' });
    }
});


////////////////////////////////////////////////REgion-pais-ciudades////////////////////////////////////////////////////

//Buscar todas las region
app.get('/regiones', (req,res)=>{
    sequelize.query("SELECT * FROM crm.regiones;",
    {
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});
//Buscar un pais
app.get('/paises', (req,res)=>{
    sequelize.query("SELECT * FROM crm.paises where id_region = ?;",
    {   replacements:[req.query.id],
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});
//Buscar todas los paises
app.get('/paisesTodos', (req,res)=>{
    sequelize.query("SELECT * FROM crm.paises where id_region;",
    {   
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});

//Buscar todas las ciudades
app.get('/ciudades', (req,res)=>{
    sequelize.query("SELECT * FROM crm.ciudades where id_pais = ?;",
    {   replacements:[req.query.id],
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});
//Buscar todas las ciudades
app.get('/ciudadesTodas', (req,res)=>{
    sequelize.query("SELECT ciudades.id,ciudades.nombre,paises.nombre AS pais FROM crm.ciudades join crm.paises on paises.id = ciudades.id_pais order by ciudades.nombre;",
    {   replacements:[req.query.id],
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});

//Buscar todas las regiones
app.get('/regionesTodas', (req,res)=>{
    sequelize.query("SELECT regiones.id,regiones.nombre AS region, paises.id,paises.nombre AS pais, ciudades.id,ciudades.nombre AS ciudad FROM crm.regiones join crm.paises on regiones.id = paises.id_region join crm.ciudades on paises.id = ciudades.id_pais;",
    {
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});

//Crear Region
app.post('/crearRegion', async (req,res)=>{
    const region = await queryRegion.BuscarRegionPorNombre(req.body);
    console.log(region.length);
    if (region.length) {
        return res.status(405).json({ error: "La región ya existe" });
    }
    sequelize.query("INSERT INTO `crm`.`regiones` (`nombre`) VALUES (?);",
    {
        replacements:[req.body.nombre],
        type: sequelize.QueryTypes.INSERT
    }).then(result =>{
        res.status(200).json('Nueva región creada');
    }).catch(err=>{
        res.status(500).json(err);
    })
 });

 //Crear pais
app.post('/crearPais', async (req,res)=>{
    const pais = await queryPais.BuscarPaisPorNombre(req.body);
    if (pais.length) {
        return res.status(405).json({ error: "La pais ya existe" });
    }
    sequelize.query("INSERT INTO `crm`.`paises` (`nombre`,`id_region`) VALUES (?,?);",
    {
        replacements:[req.body.nombre,req.body.id_region],
        type: sequelize.QueryTypes.INSERT
    }).then(result =>{
        res.status(200).json('Nueva región creada: ' + req.body.nombre);
    }).catch(err=>{
        res.status(500).json(err);
    })
 });

 //Crear Ciudad
 app.post('/crearCiudad', async (req,res)=>{
    const ciudad = await queryCiudad.BuscarCiudadPorNombre(req.body);
    if (ciudad.length) {
        return res.status(405).json({ error: "La ciudad ya existe" });
    }
    sequelize.query("INSERT INTO `crm`.`ciudades` (`nombre`,`id_pais`) VALUES (?,?);",
    {
        replacements:[req.body.nombre,req.body.id_pais],
        type: sequelize.QueryTypes.INSERT
    }).then(result =>{
        res.status(200).json('Nueva ciudad creada: ' + req.body.nombre);
    }).catch(err=>{
        res.status(500).json(err);
    })
 });

//Eliminar Region
app.delete('/eliminarRegion', async(req,res)=>{
    const regionExiste = await queryRegion.BuscarRegionPorID(req.query.id);
    if (regionExiste.length) {
        sequelize.query("DELETE FROM `crm`.`regiones` WHERE id = ?;",
        {
            replacements:[req.query.id],
            type: sequelize.QueryTypes.DELETE
        }).then(result =>{
            res.status(200).json('id de la región eliminada: ' + req.query.id);
        }).catch(err=>{
            res.status(500).json(err);
        })
    }else{
        return res.status(404).json({ error: 'La región no existe, Refresca e intenta nuevamente' });
    }
});

//Eliminar Pais
app.delete('/eliminarPais', async(req,res)=>{
    const paisExiste = await queryPais.BuscarPaisPorID(req.query.id);
    if (paisExiste.length) {
        sequelize.query("DELETE FROM `crm`.`paises` WHERE id = ?;",
        {
            replacements:[req.query.id],
            type: sequelize.QueryTypes.DELETE
        }).then(result =>{
            res.status(200).json('id del pais eliminado: ' + req.query.id);
        }).catch(err=>{
            res.status(500).json(err);
        })
    }else{
        return res.status(404).json({ error: 'El pais no existe, Refresca e intenta nuevamente' });
    }
});

//Eliminar Ciudad
app.delete('/eliminarCiudad', async(req,res)=>{
    const ciudadExiste = await queryCiudad.BuscarCiudadPorID(req.query.id);
    if (ciudadExiste.length) {
        sequelize.query("DELETE FROM `crm`.`ciudades` WHERE id = ?;",
        {
            replacements:[req.query.id],
            type: sequelize.QueryTypes.DELETE
        }).then(result =>{
            res.status(200).json('id de la Ciudad eliminada: ' + req.query.id);
        }).catch(err=>{
            res.status(500).json(err);
        })
    }else{
        return res.status(404).json({ error: 'La Ciudad no existe, Refresca e intenta nuevamente' });
    }
});

 //Modificar Region
//localhost:7000/modificarRegion?id_region=
app.put('/modificarRegion', async (req,res)=>{
    const region = await queryRegion.BuscarRegionPorNombre(req.body);
    console.log(region.length);
    if (region.length) {
        return res.status(405).json({ error: "La región ya existe" });
    }
    const regionExiste = await queryRegion.BuscarRegionPorID(req.query.id_region);
    if (regionExiste.length) {
        sequelize.query("UPDATE `crm`.`regiones` SET `nombre` = ? WHERE `id` = ?;",
        {
            replacements:[req.body.nombre,req.query.id_region],
            type: sequelize.QueryTypes.UPDATE
        }).then(result =>{
            res.status(200).json('La Región fue modificada');
        }).catch(err=>{
            res.status(500).json(err);
        })
    } else{
        return res.status(404).json({ error: 'La Región no existe' });
    }
 });

  //Modificar Region
//localhost:7000/modificarPais?id_pais=
app.put('/modificarPais', async (req,res)=>{
    
    const pais = await queryPais.BuscarPaisPorNombre(req.body);
    if (pais.length) {
        return res.status(405).json({ error: "La pais ya existe" });
    }
    const paisExiste = await queryPais.BuscarPaisPorID(req.query.id_pais);
    if (paisExiste.length) {
        sequelize.query("UPDATE `crm`.`paises` SET `nombre` = ? WHERE `id` = ?;",
        {
            replacements:[req.body.nombre,req.query.id_pais],
            type: sequelize.QueryTypes.UPDATE
        }).then(result =>{
            res.status(200).json('El pais fue modificada');
        }).catch(err=>{
            res.status(500).json(err);
        })
    } else{
        return res.status(404).json({ error: 'El pais no existe' });
    }
 });

   //Modificar Ciudad
//localhost:7000/modificarCiudad?id_ciudad=
app.put('/modificarCiudad', async (req,res)=>{
    const ciudad = await queryCiudad.BuscarCiudadPorNombre(req.body);
    if (ciudad.length) {
        return res.status(405).json({ error: "La ciudad ya existe" });
    }
    const paisExiste = await queryCiudad.BuscarCiudadPorID(req.query.id_ciudad);
    if (paisExiste.length) {
        sequelize.query("UPDATE `crm`.`ciudades` SET `nombre` = ? WHERE `id` = ?;",
        {
            replacements:[req.body.nombre,req.query.id_ciudad],
            type: sequelize.QueryTypes.UPDATE
        }).then(result =>{
            res.status(200).json('La Ciudad fue modificada');
        }).catch(err=>{
            res.status(500).json(err);
        })
    } else{
        return res.status(404).json({ error: 'La Ciudad no existe' });
    }
 });


////////////////////////////////////////////////COMPAÑIA///////////////////////////////////////////////////////

//Buscar todos las compañia
app.get('/companias', (req,res)=>{
    sequelize.query("SELECT companias.id,companias.nombre,paises.nombre AS pais,companias.direccion FROM crm.companias join crm.ciudades on companias.id_ciudad = ciudades.id join crm.paises on paises.id = ciudades.id_pais order by companias.nombre;",
    {
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});

//Buscar una comapañia
app.get('/companiasBuscar', (req,res)=>{
    sequelize.query("SELECT companias.id ,companias.nombre ,companias.direccion ,companias.email ,companias.telefono,ciudades.id AS id_ciudad ,ciudades.nombre AS ciudad ,paises.id AS id_pais ,paises.nombre AS pais ,regiones.id AS id_region ,regiones.nombre AS region FROM crm.companias join ciudades on companias.id_ciudad = ciudades.id join paises on  ciudades.id_pais = paises.id join regiones on  paises.id_region = regiones.id where companias.id = ?;",
    {   replacements:[req.query.id],
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});

 //Crear compañia
 app.post('/crearCompania',validacionesCompania.validarDatoscompania, async (req,res)=>{
    const compania = await queryCompania.BuscarCompaniaPorNombre(req.body);
    if (compania.length) {
        return res.status(405).json({ error: "La compañia ya existe" });
    }
    sequelize.query("INSERT INTO `crm`.`companias` (`nombre`,`direccion`,`email`,`telefono`,`id_ciudad`) VALUES (?,?,?,?,?);",
    {
        replacements:[req.body.nombre,req.body.direccion,req.body.email,req.body.telefono,req.body.id_ciudad],
        type: sequelize.QueryTypes.INSERT
    }).then(result =>{
        res.status(200).json('Nueva compañia creada: ' + req.body.nombre);
    }).catch(err=>{
        res.status(500).json(err);
    })
 });

 //Modificar compañia
//localhost:7000/modificarCompania?id_compania=
app.put('/modificarCompania',validacionesCompania.validarDatoscompania, async (req,res)=>{
    const CompaniaExiste = await queryCompania.BuscarCompaniaPorID(req.query.id_compania);
    if (CompaniaExiste.length) {
        sequelize.query("UPDATE `crm`.`companias` SET `nombre` = ?, `direccion` = ?, `email` = ?, `telefono` = ?, `id_ciudad` = ? WHERE `id` = ?;",
        {
            replacements:[req.body.nombre,req.body.direccion,req.body.email,req.body.telefono,req.body.id_ciudad,req.query.id_compania],
            type: sequelize.QueryTypes.UPDATE
        }).then(result =>{
            res.status(200).json('La compañia: fue modificado');
        }).catch(err=>{
            res.status(500).json(err);
        })
    } else{
        return res.status(404).json({ error: 'La compañia no existe' });
    }
 });

//Eliminar Ciudad
app.delete('/eliminarCompania', async(req,res)=>{
    const ciudadExiste = await queryCompania.BuscarCompaniaPorID(req.query.id);
    if (ciudadExiste.length) {
        sequelize.query("DELETE FROM `crm`.`companias` WHERE id = ?;",
        {
            replacements:[req.query.id],
            type: sequelize.QueryTypes.DELETE
        }).then(result =>{
            res.status(200).json('id de la compañia eliminada: ' + req.query.id);
        }).catch(err=>{
            res.status(500).json(err);
        })
    }else{
        return res.status(404).json({ error: 'La compañia no existe, Refresca e intenta nuevamente' });
    }
});

////////////////////////////////////////////////Contactos///////////////////////////////////////////////////////

//Buscar todos las contactos
app.get('/contactos', (req,res)=>{
    sequelize.query("SELECT contactos.id,contactos.nombre,contactos.apellido,contactos.cargo,contactos.email,companias.nombre AS compania,ciudades.nombre AS ciudad,contactos.direccion,contactos.canal,contactos.interes ,regiones.nombre AS regiones,paises.nombre AS pais FROM crm.contactos join crm.companias on contactos.id_compania = companias.id join crm.ciudades  on ciudades.id =  contactos.id_ciudad join crm.paises on paises.id = ciudades.id_pais join crm.regiones on regiones.id = paises.id_region order by contactos.nombre;",
    {
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});

//Buscar contacto
app.get('/contactosBuscar', (req,res)=>{
    sequelize.query("SELECT contactos.id,contactos.nombre,contactos.apellido,contactos.cargo,contactos.email,companias.nombre AS compania,ciudades.nombre AS ciudad,contactos.direccion,contactos.canal,contactos.interes ,regiones.nombre AS regiones,paises.nombre AS pais,ciudades.id AS id_ciudad, paises.id AS id_pais, regiones.id AS id_region , companias.id AS id_compania FROM crm.contactos join crm.companias on contactos.id_compania = companias.id join crm.ciudades  on ciudades.id =  contactos.id_ciudad join crm.paises on paises.id = ciudades.id_pais join crm.regiones on regiones.id = paises.id_region where contactos.id = ?;",
    {   replacements:[req.query.id],
        type: sequelize.QueryTypes.SELECT
    }).then(result =>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json(err);
    });
});

 //Crear contactos
 app.post('/crearContactos',validacionescontacto.validarDatoscontacto, async (req,res)=>{
    const contactos = await queryContacto.BuscarContactoPorEmail(req.body);
    if (contactos.length) {
        return res.status(405).json({ error: "El contacto ya existe" });
    }
    sequelize.query("INSERT INTO `crm`.`contactos` (`nombre`,`apellido`,`cargo`,`email`,`id_compania`,`id_ciudad`,`direccion`,`canal`,`interes`) VALUES (?,?,?,?,?,?,?,?,?);",
    {
        replacements:[req.body.nombre,req.body.apellido,req.body.cargo,req.body.email,req.body.id_compania,req.body.id_ciudad,req.body.direccion,req.body.canal,req.body.interes],
        type: sequelize.QueryTypes.INSERT
    }).then(result =>{
        res.status(200).json('Nuevo contacto creado');
    }).catch(err=>{
        res.status(500).json(err);
    })
 });

 //Modificar contactos
//localhost:7000/modificarContactos?id_contacto=
app.put('/modificarContacto',validacionescontacto.validarDatoscontacto, async (req,res)=>{
    const contactoExiste = await queryContacto.BuscarcontactoPorID(req.query.id_contacto);
    if (contactoExiste.length) {
        sequelize.query("UPDATE `crm`.`contactos` SET `nombre` = ?, `apellido` = ?, `cargo` = ?, `email` = ?, `id_compania` = ?, `id_ciudad` = ?, `direccion` = ?, `interes` = ?, `canal` = ?  WHERE `id` = ?;",
        {
            replacements:[req.body.nombre,req.body.apellido,req.body.cargo,req.body.email,req.body.id_compania,req.body.id_ciudad,req.body.direccion,req.body.interes,req.body.canal,req.query.id_contacto],
            type: sequelize.QueryTypes.UPDATE
        }).then(result =>{
            res.status(200).json('El contacto: fue modificado');
        }).catch(err=>{
            res.status(500).json(err);
        })
    } else{
        return res.status(404).json({ error: 'El contacto no existe' });
    }
 });

//Eliminar Ciudad
app.delete('/eliminarContacto', async(req,res)=>{
    const contactoExiste = await queryContacto.BuscarcontactoPorID(req.query.id);
    console.log(req.query.id);
    if (contactoExiste.length) {
        sequelize.query(`DELETE FROM crm.contactos WHERE id in (${req.query.id});`,
        {
            //replacements:[req.query.id],
            type: sequelize.QueryTypes.DELETE
        }).then(result =>{
            res.status(200).json('id del contacto eliminada: ' + req.query.id);
        }).catch(err=>{
            res.status(500).json(err);
        })
    }else{
        return res.status(404).json({ error: 'El contacto no existe, Refresca e intenta nuevamente' });
    }
});

app.listen(7000,()=>{
    console.log('servidor corriendo')
});
