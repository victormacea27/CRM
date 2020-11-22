setTimeout(() => {
    $(document).ready(function() {
        $('#tablaCompanias').DataTable();
    });
}, 1000);

//vista crear
let btnRegistrar=document.getElementById('addCompany');
btnRegistrar.addEventListener('click', ocultar)

let formCrear = document.getElementById('modalCompany');
let lista = document.getElementById('list');

let respuestaCrear = document.getElementById("responseCrearCompania");

let filas = document.getElementById("rows");

function ocultar() {
    formCrear.style.display = "block";
    lista.style.display = "none";
    btnRegistrar.style.display= "none";

    let creaCompania = document.getElementById("creaCompania");
    creaCompania.addEventListener('click', validarDatosCrear);

}
function mostrar() {
    formCrear.style.display = "none";
    lista.style.display = "block";
    btnRegistrar.style.display= "block";
    location.reload();
}

//Ocultar user
let menuUser = document.getElementById("btnUser");

//Cargar contactos en la tabla

window.onload = function () {
    let jwt = sessionStorage.getItem("jwt");
    if (jwt != null) {
        if (parseJwt(jwt).perfil == 2) {
            menuUser.style.display= "none";
        }
        fetch('http://localhost:7000/companias', {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
        }).then(res => {
            res.json().then(data => {
                    console.log(data)
               
                data.forEach((e) => {
                    let template = `<tr>
                        <td>${e.nombre}</td>
                        <td>${e.pais}</td>
                        <td>${e.direccion}</td>
                        <td>
                        <button type='button' id="${e.id}" data-toggle="modal" data-target="#editarCompania" class='btn btn-info btn-sm' onclick="companias('${jwt}','${e.id}')" ><span class="material-icons">Editar</span></button>
                            <button type='button' class='btn btn-danger btn-sm' onclick="eliminarCompania('${jwt}','${e.id}')" ><span class="material-icons">Eliminar</span></button>
                        </td></tr>`;
                        filas.insertAdjacentHTML('beforeend', template);
                });
            });
        }).catch(error => {
            console.log(error);
        });
        regiones(jwt);
    } else {
      console.log('error 2');
    }
};

//Consulta de datos

let listaRegiones = document.getElementById("region");
let listaPais = document.getElementById("pais");
let listaCiudades = document.getElementById("ciudad");

function regiones(jwt) {
    fetch('http://localhost:7000/regiones/', {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            data.forEach((e) => {
                let templateRegion = `<option value=${e.id}>${e.nombre}</option>`
                listaRegiones.insertAdjacentHTML('beforeend', templateRegion);
                console.log(templateRegion);
            });
        });
        console.log('entro');
        listaRegiones.addEventListener('change', () => {
            document.getElementById('pais').innerHTML = '';
            document.getElementById('ciudad').innerHTML = '';
            let opcion = document.createElement("option");
            opcion.innerHTML = "Selecciona una opción";
            opcion.value = 0;
            listaPais.appendChild(opcion);
            BuscarPais(jwt, listaRegiones.value);
        });
    }).catch(error => {
        console.log(error);
    });
};

function BuscarPais(jwt, id) {
    fetch(`http://localhost:7000/paises?id=${id}`, {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            let opcion = document.createElement("option");
            opcion.innerHTML = "Selecciona una opción";
            opcion.value = 0;
            document.getElementById('ciudad').innerHTML = '';
            listaCiudades.appendChild(opcion);
            data.forEach((e) => {
                let templatePais = `<option value=${e.id}>${e.nombre}</option>`
                listaPais.insertAdjacentHTML('beforeend', templatePais);
            });
        });
        listaPais.addEventListener('change', () => {
            buscarCiudades(jwt, listaPais.value);
        });
    }).catch(error => {
        console.log(error);
    });
}

function buscarCiudades(jwt, id) {
    fetch(`http://localhost:7000/ciudades?id=${id}`, {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            let opcion = document.createElement("option");
            opcion.innerHTML = "Selecciona una opción";
            opcion.value = 0;
            document.getElementById('ciudad').innerHTML = '';
            listaCiudades.appendChild(opcion);
            data.forEach((e) => {
                let templateCiudad = `<option value=${e.id}>${e.nombre}</option>`
                listaCiudades.insertAdjacentHTML('beforeend', templateCiudad);
            });
        });
    }).catch(error => {
        console.log(error);
    });
}

let nombreCompania = document.getElementById("nombre");
let direcccionCompania= document.getElementById("direccion");
let emailCompania = document.getElementById("email");
let telefonoContacto = document.getElementById("telefono");

function crearCompania(jwt) {
    console.log('crearCompania');
    if (jwt != null) {
        console.log('crearCompania2');
       fetch("http://localhost:7000/crearcompania", {
            method: 'POST',
            body: `{
                        "nombre": "${nombreCompania.value}",
                        "direccion": "${direcccionCompania.value}",
                        "email": "${emailCompania.value}",
                        "telefono": "${telefonoContacto.value}",
                        "id_ciudad": ${listaCiudades.value}
            }`,
            headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
            console.log(data);
            mostrar();
            });
        } else {
            console.log("error");
            respuestaCrear.textContent = "La compañia ya esta registrado intenta un nombre diferente";
            }
        }).catch(error => {
            console.log(error);
            respuestaCrear.textContent = "Se presento un error intenta nuevamente";
        }); 
    } 
}

//eliminar
function eliminarCompania(jwt, id) {
    if (jwt != null) {
       fetch(`http://localhost:7000/eliminarCompania?id=${id}`, {
            method: 'DELETE',
            body: `{
            }`,
            headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
            console.log(data);
            location.reload();
            });
        } else {
            console.log("error2");
            alert('Primero se debe eliminar los conctatos asociados a la compañia')
            }
        }).catch(error => {
            console.log(error);
        }); 
    } 
}


//Editar
//buscar compania
let edicionCompania=document.getElementById('editCompany');

function companias(jwt, id) {
    fetch(`http://localhost:7000/companiasBuscar?id=${id}`, {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            console.log(data);
            document.getElementById('editCompany').innerHTML = '';
                let template =`<div class="form-group">
                <div class="col-md-12">
                    <label for="nombre">Nombre:</label>
                    <input value="${data[0].nombre}" id="nombre" name="nombre" type="text" placeholder="Nombres" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <div class="col-md-12">
                    <label for="direccion">Dirección:</label>
                    <input value="${data[0].direccion}" id="direccion" name="direccion" type="text" placeholder="direcion" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <div class="col-md-12">
                    <label for="email">Email:</label>
                    <input value="${data[0].email}" id="email" name="email" type="text" placeholder="Email Address" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <div class="col-md-12">
                    <label for="telefono">Teléfono:</label>
                    <input value="${data[0].telefono}" id="telefono" name="telefono" type="text" placeholder="telefono" class="form-control">
                </div>
              </div>        
              <div class="form-group">
                <div class="col-md-12">
                  <label class="control-label">Región:</label>
                  <select id="region" class="form-control" placeholder="Selecciona una opción">
                  <option value='0'>Selecciona una opción</option>
                    <!-- CODE HERE -->
                  </select>
                </div>
              </div>
              <div class="form-group">
              <div class="col-md-12">
                <label class="control-label">País:</label>
                <select id="pais" class="form-control" placeholder="Selecciona una opción">
                <option value='0'>Selecciona una opción</option>
                  <!-- CODE HERE -->
                </select>
              </div>
              </div>
              <div class="form-group">
                <div class="col-md-12">
                  <label class="control-label">Ciudad:</label>
                  <select id="ciudad" class="form-control" placeholder="Selecciona una opción">
                  <option value='0'>Selecciona una opción</option>
                    <!-- CODE HERE -->
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">cancelar</button>
                <button type="button" onclick="editarCompania('${jwt}','${data[0].id}')" class="btn btn-primary">Guardar</button>
              </div>`
              edicionCompania.insertAdjacentHTML('beforeend', template);
              regionesEditar(jwt);
              
        });
    }).catch(error => {
        console.log(error);
    });
    console.log(jwt);
};


function editarCompania(jwt, id) {
    let nombreCompania = document.getElementById("nombre");
    let direccionCompania = document.getElementById("direccion");
    let emailCompania = document.getElementById("email");
    let telefonoCompania = document.getElementById("telefono");
    let ciudadCompania =document.getElementById("ciudad");
    console.log(nombreCompania.value +'- '+ direccionCompania.value +'- '+ emailCompania.value +'- '+ telefonoCompania.value +' -'+ ciudadCompania.value );
    if (jwt != null) {
       fetch(`http://localhost:7000/modificarCompania?id_compania=${id}`, {
        
            method: 'PUT',
            body: `    {
                "nombre": "${nombreCompania.value}",
                "direccion": "${direccionCompania.value}",
                "email": "${emailCompania.value}",
                "telefono": "${telefonoCompania.value}",
                "id_ciudad": "${ciudadCompania.value}"
            }`,
            headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
            console.log(data);
            location.reload();
            });
        } else {
            console.log("error");
            }
        }).catch(error => {
            console.log(error);
        }); 
    } 
}


function regionesEditar(jwt) {
    console.log('buscar regiones');
    let listaRegionesEditar = document.getElementById("region");
    let listapaisAntesEditar = document.getElementById("pais");

    fetch('http://localhost:7000/regiones/', {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            data.forEach((e) => {
                let templateRegion = `<option value=${e.id}>${e.nombre}</option>`
                listaRegionesEditar.insertAdjacentHTML('beforeend', templateRegion);
            });
        });
        console.log('entro pais');
        listaRegionesEditar.addEventListener('change', () => {
            document.getElementById('pais').innerHTML = '';
            document.getElementById('ciudad').innerHTML = '';
            let opcion = document.createElement("option");
            opcion.innerHTML = "Selecciona una opción";
            opcion.value = 0;
            listapaisAntesEditar.appendChild(opcion);
            paisEditar(jwt, listaRegionesEditar.value);
        });
    }).catch(error => {
        console.log(error);
    });
};

function paisEditar(jwt, id) {
    let listaPaisEditar = document.getElementById("pais");
    let listaciudadAntesEditar = document.getElementById("ciudad");
    fetch(`http://localhost:7000/paises?id=${id}`, {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            let opcion = document.createElement("option");
            opcion.innerHTML = "Selecciona una opción";
            opcion.value = 0;
            document.getElementById('ciudad').innerHTML = '';
            listaciudadAntesEditar.appendChild(opcion);
            data.forEach((e) => {
                let templatePais = `<option value=${e.id}>${e.nombre}</option>`
                listaPaisEditar.insertAdjacentHTML('beforeend', templatePais);
            });
        });
        console.log('entro ciudad');
        listaPaisEditar.addEventListener('change', () => {
        ciudadEditar(jwt, listaPaisEditar.value);
        });       
        
    }).catch(error => {
        console.log(error);
    });
}

function ciudadEditar(jwt, id) {
    console.log(id);
    let listaCiudadEditar = document.getElementById("ciudad");
    fetch(`http://localhost:7000/ciudades?id=${id}`, {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            console.log(data);
            let opcion = document.createElement("option");
            opcion.innerHTML = "Selecciona una opción";
            opcion.value = 0;
            document.getElementById('ciudad').innerHTML = '';
            listaCiudades.appendChild(opcion);
            data.forEach((e) => {
                let templateCiudad = `<option value=${e.id}>${e.nombre}</option>`
                listaCiudadEditar.insertAdjacentHTML('beforeend', templateCiudad);
            });
        });
    }).catch(error => {
        console.log(error);
    });
}

//Desifrar token
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

function validarDatosCrear() {
    let jwt = sessionStorage.getItem("jwt");
    //console.log(nombre.value +' - '+ direccion.value +' - '+ email.value +' - '+ telefono.value +' - '+ region.value +' - '+ pais.value +' - '+ ciudad.value );
    if (nombre.value == ''  || direccion.value == '' || email.value == '' || telefono.value == '' || pais.value == 0 || ciudad.value == 0) {
        alert('Todos los campos son obligatorios')
    } else{    
        console.log('creado');
        crearCompania(jwt);
    }    
}