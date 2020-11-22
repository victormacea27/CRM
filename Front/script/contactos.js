setTimeout(() => {
    $(document).ready(function() {
        $('#tablaContactos').DataTable();
    });
}, 1000);

//vista crear
let btnRegistrar=document.getElementById('addContact');
let btnEliminar=document.getElementById('deleteContact');
btnRegistrar.addEventListener('click', ocultar)

let formCrear = document.getElementById('modalContact');
let lista = document.getElementById('list');
let respuestaCrear = document.getElementById("responseCrearContacto");
let filas = document.getElementById("rows");

function ocultar() {
    formCrear.style.display = "block";
    lista.style.display = "none";
    btnRegistrar.style.display= "none";
    btnEliminar.style.display= "none";    
}
function mostrar() {
    formCrear.style.display = "none";
    lista.style.display = "block";
    btnRegistrar.style.display= "block";
    btnEliminar.style.display= "block";
    location.reload();
}

//Ocultar user
let menuUser = document.getElementById("btnUser");
let CrearContactoNuevo = document.getElementById("creaContacto");

//Cargar contactos en la tabla
window.onload = function () {
    let jwt = sessionStorage.getItem("jwt");
    if (jwt != null) {
        if (parseJwt(jwt).perfil == 2) {
            menuUser.style.display= "none";
        }
        fetch('http://localhost:7000/contactos', {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
        }).then(res => {
            res.json().then(data => {
                    //console.log(data)
                data.forEach((e) => {
                    let template = `<tr>
						<td><input type="checkbox" value=${e.id}></td>
                        <td>${e.nombre} ${e.apellido}</td>
                        <td>${e.pais} / ${e.regiones}</td>
                        <td>${e.compania}</td>
                        <td>${e.cargo}</td>
                        <td>${e.canal}</td>
                        <td><div class="progress">
                                <div class="progress-bar" style="width: ${e.interes}%" role="progressbar" aria-valuenow="${e.interes}" aria-valuemin="0" aria-valuemax="100">${e.interes}%</div>
                            </div>
                        </td>
                        <td><button type='button' id="${e.id}" data-toggle="modal" data-target="#editarContactos" class='btn btn-info btn-sm' onclick="contactos('${jwt}','${e.id}')"><span class="material-icons">editar</span></button>
                            <button type='button' class='btn btn-danger btn-sm' data-toggle="modal" data-target="#ConfirmarEliminarContacto"><span class="material-icons" onclick="modalEliminarContacto('${jwt}','${e.id}','${e.nombre} ${e.apellido}')">Eliminar</span></button>
                        </td></tr>`;  
                        filas.insertAdjacentHTML('beforeend', template); 
                });
            });
        }).catch(error => {
            console.log(error);
        });
        companias(jwt);
        regiones(jwt);
    } else {
      console.log('error');
    }
    CrearContactoNuevo.addEventListener('click', () => {
    validarDatosCrear(jwt);
    });
};

//Consulta de ciudades pais y region

let listaCompanias = document.getElementById("compania");
let listaRegiones = document.getElementById("region");
let listaPais = document.getElementById("pais");
let listaCiudades = document.getElementById("ciudad");

function companias(jwt) {
    fetch('http://localhost:7000/companias', {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {

            data.forEach((e) => {
                let templateCompanies = `<option value=${e.id}>${e.nombre}</option>`
                listaCompanias.insertAdjacentHTML('beforeend', templateCompanies);
            });
        });
    }).catch(error => {
        console.log(error);
    });
};

function regiones(jwt) {
    fetch('http://localhost:7000/regiones/', {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            data.forEach((e) => {
                let templateRegion = `<option value=${e.id}>${e.nombre}</option>`
                listaRegiones.insertAdjacentHTML('beforeend', templateRegion);
            });
        });
        listaRegiones.addEventListener('change', () => {
            document.getElementById('pais').innerHTML = '';
            document.getElementById('ciudad').innerHTML = '';
            let opcion = document.createElement("option");
            opcion.innerHTML = "Selecciona una opción1";
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
            opcion.innerHTML = "Selecciona una opción1";
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
            opcion.innerHTML = "Selecciona una opción2";
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

let nombreContacto = document.getElementById("nombre");
let apellidoContacto = document.getElementById("apellido");
let cargoContacto = document.getElementById("cargo");
let emailContacto = document.getElementById("email");
let direcccionContacto = document.getElementById("direccion");
let canalContacto =document.getElementById("canal");
let interesContacto =document.getElementById("interes");



function crearContacto(jwt) {
    //console.log('nombre: '+nombreContacto.value+' apellido: '+apellidoContacto.value +' cargo: '+cargoContacto.value +' email: '+emailContacto.value +' compania: '+listaCompanias.value +' ciudad: '+listaCiudades.value +' direccion: '+direcccionContacto.value +' canal: '+canalContacto.value +' interes: '+interesContacto.value);
    if (jwt != null) {
       fetch("http://localhost:7000/crearContactos", {
            method: 'POST',
            body: `{
                    "nombre": "${nombreContacto.value}",
                    "apellido": "${apellidoContacto.value}",
                    "cargo": "${cargoContacto.value}",
                    "email": "${emailContacto.value}",
                    "id_compania": ${listaCompanias.value},
                    "id_ciudad": ${listaCiudades.value},
                    "direccion": "${direcccionContacto.value}",
                    "canal": "${canalContacto.value}",
                    "interes": ${interesContacto.value}
            }`,
            headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
            console.log(data);
            mostrar();
            });
        } else {
            respuestaCrear.textContent = "El correo ya esta registrado intenta uno diferente";
            }
        }).catch(error => {
            console.log(error);
            respuestaCrear.textContent = "Se presento un error intenta nuevamente";
        }); 
    } 
}

//eliminar
function eliminarContacto(jwt, id) {
    if (jwt != null) {
       fetch(`http://localhost:7000/eliminarContacto?id=${id}`, {
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
            alert('Primero se debe eliminar los conctatos asociados a la compañia')
            }
        }).catch(error => {
            console.log(error);
        }); 
    } 
}

//Editar
//buscar contacto
let edicionContactos=document.getElementById('editContact');

function contactos(jwt, id) {
    fetch(`http://localhost:7000/contactosBuscar?id=${id}`, {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            document.getElementById('editContact').innerHTML = '';
                let template =`
                <div class="form-group">
                    <div class="col-md-12">
                        <label for="nombre">Nombre:</label>
                        <input value="${data[0].nombre}" id="nombre" name="nombre" type="text" placeholder="Nombres" class="form-control" required>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-12">
                        <label for="apellido">Apellido:</label>
                        <input value="${data[0].apellido}" id="apellido" name="apellido" type="text" placeholder="direcion" class="form-control" required>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-12">
                        <label for="cargo">Cargo:</label>
                        <input value="${data[0].cargo}" id="cargo" name="cargo" type="text" placeholder="Email Address" class="form-control" required>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-12">
                        <label for="email">Email:</label>
                        <input value="${data[0].email}" id="email" name="email" type="text" placeholder="Email Address" class="form-control" required>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-12">
                        <label class="control-label">Compañia:</label>
                        <select id="compania" class="form-control" placeholder="Selecciona una opción" required>
                        <option value=${data[0].id_compania}>${data[0].compania}</option>
                            <!-- CODE HERE -->
                        </select>
                    </div>
                </div>  
                <div class="form-group">
                    <div class="col-md-12">
                    <label class="control-label">Región:</label>
                    <select id="region" class="form-control" placeholder="Selecciona una opción" required>
                    <option value='0'>Selecciona una opción</option>
                        <!-- CODE HERE -->
                    </select>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-12">
                        <label class="control-label">País:</label>
                        <select id="pais" class="form-control" placeholder="Selecciona una opción" required>
                        <option value='0'>Selecciona una opción</option>
                        <!-- CODE HERE -->
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-12">
                    <label class="control-label">Ciudad:</label>
                    <select id="ciudad" class="form-control" placeholder="Selecciona una opción" required>
                    <option value='0'>Selecciona una opción</option>
                        <!-- CODE HERE -->
                    </select>
                    </div>
                <div class="form-group">
                  <div class="col-md-12">
                      <label for="direccion">Dirección:</label>
                      <input value="${data[0].direccion}" id="direccion" name="direccion" type="text" placeholder="direcion" class="form-control" required>
                  </div>
                </div>
                <div class="form-group">
                    <div class="col-md-12">
                        <label class="control-label">Interes:</label>
                        <select id="interes" class="form-control" placeholder="Selecciona una opción" required>
                            <option value=${data[0].interes}>${data[0].interes}%</option>
                            <option value="0">0%</option>
                            <option value="25">25%</option>
                            <option value="50">50%</option>
                            <option value="75">75%</option>
                            <option value="100">100%</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-12">
                    <label class="control-label">canal de contacto:</label>
                    <select id="canal" class="form-control" placeholder="Selecciona una opción" required>
                    <option value=${data[0].canal}>${data[0].canal}</option>
                    <option value="Celular">Celular</option>
                    <option value="Email">Email</option>
                    <option value="Fabebook">Fabebook</option>
                    <option value="Linkedin">LinkedIn</option>
                    <option value="Whatsapp">Whatsapp</option>
                    </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    <button type="button" onclick="validarDatosEditar('${jwt}','${data[0].id}')" class="btn btn-primary">Guardar</button>
                </div>
                <p id="responseEditarContacto" class="login-card-footer-text"></p>`
              edicionContactos.insertAdjacentHTML('beforeend', template);
              regionesEditar(jwt);
        });
    }).catch(error => {
        console.log(error);
    });
};


function editarContacto(jwt, id) {
    let nombreContacto = document.getElementById("nombre");
    let apellidoContacto = document.getElementById("apellido");
    let cargoContacto = document.getElementById("cargo");
    let emailContacto = document.getElementById("email");
    let ciudadContacto =document.getElementById("ciudad");
    let direccionContacto =document.getElementById("direccion");
    let interesContacto =document.getElementById("interes");
    let canalContacto =document.getElementById("canal");
    let companiaContacto =document.getElementById("compania");
    let respuestaEditarContacto = document.getElementById("responseEditarContacto");
    //console.log(nombreContacto.value +' -'+ apellidoContacto.value +' -'+ cargoContacto.value +'- '+ emailContacto.value +' -'+ ciudadContacto.value +' -'+ direccionContacto.value +' -'+ interesContacto.value +'canall: '+ canalContacto.value );
    if (jwt != null) {
       fetch(`http://localhost:7000/modificarContacto?id_contacto=${id}`, {
            method: 'PUT',
            body: `    {
                "nombre": "${nombreContacto.value}",
                "apellido": "${apellidoContacto.value}",
                "cargo": "${cargoContacto.value}",
                "email": "${emailContacto.value}",
                "id_compania": ${companiaContacto.value},
                "id_ciudad": ${ciudadContacto.value},
                "canal": "${canalContacto.value}",
                "interes": ${interesContacto.value},
                "direccion": "${direccionContacto.value}"
            }`,
            headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
            location.reload();
            });
        } else {
            console.log("error");
            respuestaEditarContacto.textContent = "Error";
            
            }
        }).catch(error => {
            console.log(error);
        }); 
    } 
}

function modalEliminarContacto(jwt,id,nombre) {
    document.getElementById('ModalEliminarContacto').innerHTML = '';
    let modal = document.getElementById('ModalEliminarContacto');
    
    let template = `<label for="region-id:">¿Esta seguro de eliminar el contacto: ${nombre}?</label>
    <div class="modal-footer">
    <button type="button" class="btn btn-success" onclick="eliminarContacto('${jwt}',${id})">Confirmar</button>
    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
    </div>`;
    modal.insertAdjacentHTML('beforeend', template);    
}

function validarDatosCrear(jwt) {
    if (nombre.value == ''  || apellido.value == '' || email.value == '' || cargo.value == '' || direccion.value == '' || ciudad.value == 0) {
        alert('Todos los campos son obligatorios')
    } else{    
            console.log('creado')
            crearContacto(jwt);
    }    
}

function validarDatosEditar(jwt,id) {
    console.log('validar datos');
    let nombreEditar = document.getElementById('nombre');
    let emailEditar = document.getElementById('email');
    let cargoEditar = document.getElementById('cargo');
    let direccionEditar = document.getElementById('direccion');
    let ciudadEditar = document.getElementById('ciudad');
    if (nombreEditar.value == ''  || emailEditar.value == '' || cargoEditar.value == '' || direccionEditar.value == '' || direccion.value == '' || ciudadEditar.value == 0) {
        alert('Todos los campos son obligatorios')
    } else{    
            console.log('editado')
            editarContacto(jwt,id);
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

//eliminar seleccionados
function Eliminarseleccionados() {
    let token = sessionStorage.getItem("jwt");
    let checkboxes = document.getElementById('rows').querySelectorAll("input[type='checkbox']");
    let idsEliminar = [];
    checkboxes.forEach((checkbox) => {
		if (checkbox.checked) {
			idsEliminar.push(parseInt(checkbox.value));
		}
	});
    document.getElementById('ModalEliminarContacto').innerHTML = '';
        let modal = document.getElementById('ModalEliminarContacto');
    if (idsEliminar.length > 0) {
        let template = `<label for="region-id:">¿Esta seguro de eliminar los contactos seleccionados?</label>
        <div class="modal-footer">
        <button type="button" class="btn btn-success" onclick="eliminarContacto('${token}','${idsEliminar}')">Confirmar</button>
        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
        </div>`;
        modal.insertAdjacentHTML('beforeend', template);  
    } else {
        let template = `<label for="region-id:">No seleccionaste ningun usuario, selecciona los usuarios a eliminar e intenta nuevamente</label>
        <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
        </div>`;
        modal.insertAdjacentHTML('beforeend', template);
    }
    
    
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