const validarDatoscompania = (req, res, next)=>{
    let compania = req.body;
    if(compania.nombre && compania.direccion && compania.email && compania.telefono){

        if(typeof(compania.nombre) === "string" 
        && typeof(compania.direccion) === "string" 
        && typeof(compania.email) ==="string" 
        && typeof(compania.telefono) ==="string"){
            next();
        }else{res.send("Valida que los tipos datos sean correctos")}
    }else{res.send("datos incompletos o incorrectos")}
};



module.exports = {
    validarDatoscompania
};