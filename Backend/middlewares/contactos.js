const validarDatoscontacto = (req, res, next)=>{
    console.log(req.body);
    let contacto = req.body;
    if(contacto.nombre && contacto.apellido && contacto.email && contacto.cargo){

        if(typeof(contacto.nombre) === "string" 
        && typeof(contacto.apellido) === "string" 
        && typeof(contacto.email) ==="string" 
        && typeof(contacto.cargo) ==="string"){
            next();
        }else{res.send("Valida que los tipos datos sean correctos")}
    }else{res.send("datos incompletos o incorrectos2")}
};



module.exports = {
    validarDatoscontacto
};