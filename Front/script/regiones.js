var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}

//Ocultar user
let menuUser = document.getElementById("btnUser");

//Cargar regiones en el arbol
let arbol = document.getElementById("myUL");
window.onload = function () {
    let jwt = sessionStorage.getItem("jwt");
    if (jwt != null) {
        if (parseJwt(jwt).perfil == 2) {
            menuUser.style.display= "none";
        }
        fetch('http://localhost:7000/regiones', {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
        }).then(res => {
            res.json().then(data => {
                    console.log(data)
                data.forEach((e) => {
                    let template = `<li><span class="caret" id="Suramerica">${e.nombre}</span>
                            <button name="Regiones" class="btn btn-outline-primary" type="submit" data-toggle="modal" data-target="#edit" id="${e.nombre}" onclick="modalRegiones('${jwt}',${e.id},'${e.nombre}')"><i class="fas fa-edit"></i></button>
                            <button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#agregarPaisCiudad" onclick="modalPaisCrear('${jwt}',${e.id},'${e.nombre}')"><i class="fas fa-plus-circle"></i></button>
                                <ul class="nested" id=${e.id}>
                                </ul>
                        </li>`;
                        arbol.insertAdjacentHTML('beforeend', template); 
                });
            });
        }).catch(error => {
            console.log(error);
        });
        paises(jwt);
    } else {
      console.log('error');
    }
};

//Cargar paises
function paises(jwt) {
    fetch('http://localhost:7000/paisesTodos', {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            data.forEach((e) => {
                let nodoRegion = document.getElementById(`${e.id_region}`);
                if (nodoRegion) {
                    let templatePaises = `<li><span class="caret">${e.nombre}</span>
                    <button type="submit" class="btn btn-outline-primary" data-toggle="modal" data-target="#edit" id="${e.id}-${e.nombre}" onclick="modalPais('${jwt}',${e.id},'${e.nombre}')"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#agregarPaisCiudad" onclick="modalCiudadCrear('${jwt}',${e.id},'${e.nombre}')"><i class="fas fa-plus-circle"></i></button>
                    <ul class="nested" id=${e.nombre}>
                    </ul>
                    </li>`
                    nodoRegion.insertAdjacentHTML('beforeend', templatePaises);  
                }
            });
        });
        ciudades(jwt);
    }).catch(error => {
        console.log(error);
    });
};

//Cargar ciudad
function ciudades(jwt) {

    fetch('http://localhost:7000/ciudadesTodas', {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {

            data.forEach((e) => {
                let nodoPais = document.getElementById(`${e.pais}`);
                if (nodoPais) {
                    let templatePais = `<li>${e.nombre}<button class="btn btn-outline-primary" type="submit" data-toggle="modal" data-target="#edit" id=${e.id} onclick="modalCiudad('${jwt}',${e.id},'${e.nombre}')"><i class="fas fa-edit"></i></button></li>`
                    nodoPais.insertAdjacentHTML('beforeend', templatePais);  
                }
            });
        });
        accionArbol();
    }).catch(error => {
        console.log(error);
    });
};

function modalRegiones(jwt,id,nombre) {
    document.getElementById('modalEdit').innerHTML = '';
    let modal = document.getElementById('modalEdit');
   
    let template = `<label for="nombre">Region:</label>
    <input id="nombre" value='${nombre}' name="name" type="text" placeholder="Ingrese el valor" class="form-control" required>
    <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
    <button type="button" class="btn btn-success" onclick="editarRegion('${jwt}',${id})" >Editar</button>
    <button type="button" class="btn btn-danger" onclick="eliminarRegion('${jwt}',${id})" >Eliminar</button>
    </div>
    <p id="responseEditarRegion" class="login-card-footer-text"></p>`;
    modal.insertAdjacentHTML('beforeend', template);    
}

function modalPais(jwt,id,nombre) {
    document.getElementById('modalEdit').innerHTML = '';
    let modal = document.getElementById('modalEdit');
    
    let template = `<label for="nombre">País:</label>
    <input id="nombre" value='${nombre}' name="name" type="text" placeholder="Ingrese el valor" class="form-control" required>
    <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
    <button type="button" class="btn btn-success" onclick="editarPais('${jwt}',${id})">Editar</button>
    <button type="button" class="btn btn-danger" onclick="eliminarPais('${jwt}',${id})">Eliminar</button>
    </div>
    <p id="responseEditarPais" class="login-card-footer-text"></p>`;
    modal.insertAdjacentHTML('beforeend', template);    
}

function modalCiudad(jwt,id,nombre) {
    document.getElementById('modalEdit').innerHTML = '';
    let modal = document.getElementById('modalEdit');
    
    let template = `<label for="nombre">Ciudad:</label>
    <input id="nombre" value='${nombre}' name="name" type="text" placeholder="Ingrese el valor" class="form-control" required>
    <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
    <button type="button" class="btn btn-success"  onclick="editarCiudad('${jwt}',${id})" >Editar</button>
    <button type="button" class="btn btn-danger" onclick="eliminarCiudad('${jwt}',${id})" >Eliminar</button>
    </div>
    <p id="responseEditarCiudad" class="login-card-footer-text"></p>`;
    modal.insertAdjacentHTML('beforeend', template);    
}

function modalPaisCrear(jwt,id,nombre) {
    document.getElementById('crearPaisCiudad').innerHTML = '';
    let modal = document.getElementById('crearPaisCiudad');
    
    let template = `<label for="region-id:">El pais se agregara a la región: ${nombre}</label>
    <input id="paisCrear" name="name" type="text" placeholder="Nombres" class="form-control" required>
    <div class="modal-footer">
    <button type="button" class="btn btn-success" onclick="CrearPais('${jwt}',${id})">Crear</button>
    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
    </div>
    <p id="agregarPais" class="login-card-footer-text"></p>`;
    modal.insertAdjacentHTML('beforeend', template);    
}

function modalCiudadCrear(jwt,id,nombre) {
    document.getElementById('crearPaisCiudad').innerHTML = '';
    let modal = document.getElementById('crearPaisCiudad');
    
    let template = `<label for="pais-id:">La ciudad se agregara al País: ${nombre}</label>
    <input id="ciudadCrear" name="name" type="text" placeholder="Nombres" class="form-control" required>
    <div class="modal-footer">
    <button type="button" class="btn btn-success" onclick="CrearCiudad('${jwt}',${id})">Crear</button>
    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
    </div>
    <p id="agregarCiudad" class="login-card-footer-text"></p>`;
    modal.insertAdjacentHTML('beforeend', template);    
}

//eliminar región
function eliminarRegion(jwt, id) {
    if (jwt != null) {
       fetch(`http://localhost:7000/eliminarRegion?id=${id}`, {
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
            alert('Primero se debe eliminar los paises y ciudades asociadas a la región')
            }
        }).catch(error => {
            console.log(error);
        }); 
    } 
}

//eliminar pais
function eliminarPais(jwt, id) {
    if (jwt != null) {
       fetch(`http://localhost:7000/eliminarPais?id=${id}`, {
            method: 'DELETE',
            body: `{
            }`,
            headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
            location.reload();
            });
        } else {
            alert('Primero se debe eliminar las ciudades asociadas a la país')
            }
        }).catch(error => {
            console.log(error);
        }); 
    } 
}

//eliminar ciudad
function eliminarCiudad(jwt, id) {
    if (jwt != null) {
       fetch(`http://localhost:7000/eliminarCiudad?id=${id}`, {
            method: 'DELETE',
            body: `{
            }`,
            headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
            location.reload();
            });
        } else {
            console.log("error al eliminar la ciudad, intenta nuevamente");
            }
        }).catch(error => {
            console.log(error);
        }); 
    } 
}

//modificar región
function editarRegion(jwt, id) {
    let regionModificar = document.getElementById('nombre');
    let respuestaEditarRegion = document.getElementById("responseEditarRegion");   
    document.getElementById('responseEditarRegion').innerHTML = '';
    if (jwt != null) {
        fetch(`http://localhost:7000/modificarRegion?id_region=${id}`, {
             method: 'PUT',
             body: `{
                     "nombre": "${regionModificar.value}"
             }`,
             headers:{"Content-Type":"application/json"}
     }).then(res => {
         if (res.status == 200) {
             res.json().then(data => {
             console.log(data);
             location.reload(); 
             });
         } else {
            respuestaEditarRegion.textContent = `La región ya existe, valida e intenta nuevamente`;
             }
         }).catch(error => {
             console.log(error);
         }); 
    }
    
}

//modificar País responseEditarPais
function editarPais(jwt, id) {
    let paisModificar = document.getElementById('nombre');
    let respuestaEditarPais = document.getElementById("responseEditarPais");   
    document.getElementById('responseEditarPais').innerHTML = '';
    if (jwt != null) {
        fetch(`http://localhost:7000/modificarPais?id_pais=${id}`, {
             method: 'PUT',
             body: `{
                     "nombre": "${paisModificar.value}"
             }`,
             headers:{"Content-Type":"application/json"}
     }).then(res => {
         if (res.status == 200) {
             res.json().then(data => {
             console.log(data);
             location.reload(); 
             });
         } else {
            respuestaEditarPais.textContent = `El país ya existe, valida e intenta nuevamente`;
             }
         }).catch(error => {
             console.log(error);
         }); 
    }
    
}

//modificar Ciudad responseEditarCiudad
function editarCiudad(jwt, id) {
    let ciudadModificar = document.getElementById('nombre');
    let respuestaEditarCuidad = document.getElementById("responseEditarCiudad");   
    document.getElementById('responseEditarCiudad').innerHTML = '';
    if (jwt != null) {
        fetch(`http://localhost:7000/modificarCiudad?id_ciudad=${id}`, {
             method: 'PUT',
             body: `{
                     "nombre": "${ciudadModificar.value}"
             }`,
             headers:{"Content-Type":"application/json"}
     }).then(res => {
         if (res.status == 200) {
             res.json().then(data => {
             console.log(data);
             location.reload();
             });
         } else {
            respuestaEditarCuidad.textContent = `La cuidad ya existe, valida e intenta nuevamente`;
             }
         }).catch(error => {
             console.log(error);
         }); 
    }
     
}

//Ceear pais 

function CrearPais(jwt,id) {
    let respuestaAgregarPais = document.getElementById("agregarPais");
    let pais=document.getElementById("paisCrear");
    document.getElementById('agregarPais').innerHTML = '';
    if (jwt != null) {
       fetch("http://localhost:7000/crearPais", {
            method: 'POST',
            body:`{"nombre":"${pais.value}",
            "id_region": ${id}}
            `,
        headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                console.log(data);
                location.reload();
            });
        } else {
            respuestaAgregarPais.textContent = `El país ya existe, valida e intenta nuevamente`;
            }
        }).catch(error => {
            console.log(error);
            respuestaAgregarPais.textContent = "Se presento un error intenta nuevamente";
        });
        
    } 
};

//Ceear ciudad

function CrearCiudad(jwt,id) {
    let respuestAgregarCiudad = document.getElementById("agregarCiudad");
    let ciudad=document.getElementById("ciudadCrear");
    document.getElementById('agregarCiudad').innerHTML = '';
    if (jwt != null) {
       fetch("http://localhost:7000/crearCiudad", {
            method: 'POST',
            body:`{"nombre":"${ciudad.value}",
            "id_pais": ${id}}
            `,
        headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                console.log(data);
                location.reload();
            });
        } else {
            respuestAgregarCiudad.textContent = `La ciudad ya existe, valida e intenta nuevamente`;
            }
        }).catch(error => {
            console.log(error);
            respuestAgregarCiudad.textContent = "Se presento un error intenta nuevamente";
        });
        
    } 
};

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

function accionArbol() {
    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
          this.parentElement.querySelector(".nested").classList.toggle("active");
          this.classList.toggle("caret-down");
        });
      }
    
}