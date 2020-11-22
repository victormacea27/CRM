const jwt = require('jsonwebtoken');
const secret = 'WoaOs41E_y~6';

//Validar Token
const validarToken = async (req, res, next) => {
    try {
      const bearerHeader = req.header("Authorization");
      //Quitar Bearer del token
      const token = bearerHeader.replace('Bearer ',''); 
      //console.log(bearerHeader);
      console.log(token);
      if (!bearerHeader) return res.status(401).json({ error: "Error en el token" });
      await jwt.verify(token, secret, (error, data) => {
        if (error) return res.status(401).json({ error: "El token es invalido" });
        req.body.id = data.id;
        req.body.id_rol = data.id_rol;
        //console.log(req.body.id_rol);
        console.log('token validado');
        next();
      });
    } catch (error) {
      res.status(400).json({ error: "Error en el token" });
    }
};

//Validación acceso
const validarLogin = (req, res, next) => {
    try {
        const usuario = req.body.usuario
        const contrasena = req.body.contrasena
        console.log('Valdiar');
        if ((!usuario) && contrasena)
            return res.status(400).json({ error: "Debe ingresar usuario y contraseña" });
            next();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
};

//Validar si es administrador o no
const validarAdmin = (req, res, next) => {
    try {
        //console.log(req.body.id_rol);
      if (req.body.id_rol !== 1)
        return res.status(403).json({ error: "La acción que desea realizar solo esta permitida para administradores" });
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

//Validación crear usuario
const validarDatosUsuario = (req, res, next)=>{
    let usuario = req.body;
    console.log(req.body);
    if(usuario.nombre && usuario.apellido && usuario.email && usuario.contrasena){
        console.log(usuario.perfil);
        if(typeof(usuario.nombre) === "string" 
        && typeof(usuario.apellido) === "string" 
        && typeof(usuario.email) ==="string" 
        && typeof(usuario.contrasena) ==="string"
        && typeof(usuario.perfil === "string")
        
         ){ 
          console.log('entro a validar udatos');
            //validando RolUsuario
            if (usuario.perfil !== '1' && usuario.perfil !== '2' ) {
                return res.send('Debe ingresar el número 1 para Rol de ADMIN ó el número 2 para Rol CLIENTE');
            }
            //validando constraseña 
            if(usuario.contrasena.length < 5){
                return res.send("La constraseña debe ser de mas de 5 caracteres")
            }
            next();
        }else{res.send("Valida que los tipos datos sean correctos")}
    }else{res.send("datos incompletos o incorrectos")}
};



module.exports = {
    //Generales
    validarToken,
    validarLogin,
    validarAdmin,
    validarDatosUsuario

};