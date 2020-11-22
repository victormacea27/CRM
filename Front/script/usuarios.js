setTimeout(() => {
    $(document).ready(function() {
        $('#tablaUsuarios').DataTable();
    });
}, 1000);



let btnRegistrar=document.getElementById('addUser');
btnRegistrar.addEventListener('click', ocultar)

let formCrear = document.getElementById('modalUser');
let lista = document.getElementById('list');

let btnCrear=document.getElementById('creaUsuario');

let respuestaCrear = document.getElementById("responseCrearUser");



//Listado de  usuarios
let filas = document.getElementById("rows");
let btnUsuario = document.getElementById("btnUser");
let btnCrearUsuario = document.getElementById("addUser");

//validar login
function ValidarLogueo() {
    let jwt = sessionStorage.getItem("jwt");
    if (jwt) {
        console.log('usuario logueado')
    }else{
        console.log('usuario no logueado')
        location.href = "index.html";
    }   
}


function ocultar() {
    formCrear.style.display = "block";
    lista.style.display = "none";
    btnRegistrar.style.display = "none";
}
function mostrar() {
    formCrear.style.display = "none";
    lista.style.display = "block";
    location.reload();
}

//Listado usuario
window.onload = function () {
    let jwt = sessionStorage.getItem("jwt");
    if (jwt != null) {
        if (parseJwt(jwt).perfil == 2) {
            menuUser.style.display= "none";
        }
        fetch('http://localhost:7000/usuarios', {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
        }).then(res => {
            res.json().then(data => {
                data.forEach((e) => {
                        let template = `<tr>
                            <td>${e.nombre}</td>
                            <td>${e.apellido}</td>
                            <td>${e.email}</td>
                            <td><button type='button' id="${e.id}" data-toggle="modal" data-target="#editarUsuario" class='btn btn-info btn-sm' onclick="usuarios('${jwt}','${e.id}')" ><span class="material-icons">editar</span></button>
                                <button type='button' id="${e.id}" class='btn btn-danger btn-sm' onclick="eliminarUsuario('${jwt}','${e.id}')" ><span class="material-icons">eliminar</span></button>
                            </td>
                            </tr>
                            `;
                            filas.insertAdjacentHTML('beforeend', template); 
                });
            });
        }).catch(error => {
            console.log(error);
        });
    } else {
        //location.href = "usuarios.html";
        console.log('error revisar');
    }
    btnCrear.addEventListener('click', () => {
        validarDatosCrear(jwt);
    });
}

function crearUsuarioNuevo(jwt) {
    let nombre=document.getElementById("nombre");
    let apellido=document.getElementById("apellido");
    let email=document.getElementById("email");
    let perfil=document.getElementById("perfil");
    let contrasena=document.getElementById("contrasena");
    console.log(jwt);
    console.log(nombre.value +'-'+  apellido.value +'-'+  email.value +'-'+  contrasena.value+'-'+ perfil.value)
    console.log('crearusuarioprueba3');
    if (jwt != null) {
       fetch("http://localhost:7000/crearUsuarioNuevo", {
            method: 'POST',
            body:`{"nombre":"${nombre.value}","apellido":"${apellido.value}","email":"${email.value}","perfil":"${perfil.value}","contrasena":"${contrasena.value}"}`,
            headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
            console.log(data);
            location.href = "usuarios.html"
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

function eliminarUsuario(jwt, id) {
    console.log('ENTRO A ELIMINAR');
    console.log(jwt);
    if (jwt != null) {
        console.log(jwt);
        console.log(id);
       fetch(`http://localhost:7000/eliminarUsuario?id=${id}`, {
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
            console.log("error");
            }
        }).catch(error => {
            console.log(error);
        }); 
    } 
}


function editarUsuario(jwt, id) {

    let nombreUsuario = document.getElementById("nombre");
    let apellidoUsuario = document.getElementById("apellido");
    let emailUsuario = document.getElementById("email");
    let perfilUsuario = document.getElementById("perfil");
    let contrasenaUsuario =document.getElementById("contrasena");

    console.log(nombreUsuario.value +'- '+ apellidoUsuario.value +' -'+ emailUsuario.value +' -'+ perfilUsuario.value +' -'+ contrasenaUsuario.value );
    if (jwt != null) {
        console.log(jwt);
        console.log(id);
       fetch(`http://localhost:7000/modificarUsuario?id_usuario=${id}`, {
            method: 'PUT',
            body: `{
                    "nombre": "${nombreUsuario.value}",
                    "apellido": "${apellidoUsuario.value}",
                    "email": "${emailUsuario.value}",
                    "perfil": "${perfilUsuario.value}",
                    "contrasena": "${contrasenaUsuario.value}"
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

let edicionUsuario=document.getElementById('editUSer');

function usuarios(jwt, id) {
    console.log(id)
    fetch(`http://localhost:7000/usuariosBuscar?id=${id}`, {
            method: 'GET',
            headers: { "Authorization": "Bearer " + jwt }
    }).then(res => {
        res.json().then(data => {
            console.log(data);
            document.getElementById('editUSer').innerHTML = '';
                let template = `<div class="form-group">
                <div class="col-md-12">
                    <label for="nombre">Nombre:</label>
                    <input value="${data[0].nombre}" id="nombre" name="name" type="text" placeholder="Nombres" class="form-control" required>
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-12">
                    <label for="apellido">Apellido:</label>
                    <input value="${data[0].apellido}" id="apellido" name="name" type="text" placeholder="Apellidos" class="form-control" required>
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-12">
                    <label for="email">Email:</label>
                    <input value="${data[0].email}" id="email" name="email" type="email" placeholder="Email Address" class="form-control" required>
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-12">
                    <label for="perfil">Perfil:</label>
                    <select id="perfil" class="form-control" placeholder="Selecciona una opción" required>
                    <option value="0">Selecciona una opción</option>    
                    <option value="1">Administrador</option>
                        <option value="2">Visitante</option>
                    </select>
                </div>
            </div>        
            <div class="form-group">
                <div class="col-md-12">
                    <label for="contrasena">contraseña:</label>
                    <input value="${data[0].contrasena}" id="contrasena" name="phone" type="password" placeholder="Contraseña" class="form-control" required>
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-12">
                    <label for="repetirContrasena">contraseña:</label>
                    <input value="${data[0].contrasena}" id="repetirContrasena" name="phone" type="password" placeholder="Repetir Contrasena" class="form-control" required>
                </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="mostrar()">Cancelar</button>
            <button type="submit" onclick="validarDatosEditar('${jwt}','${data[0].id}')" class="btn btn-primary">Editar</button>
            </div>`
                edicionUsuario.insertAdjacentHTML('beforeend', template);
        });
    }).catch(error => {
        console.log(error);
    });
};

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};




function validarDatosCrear(jwt) {
    let contrasenaUno = document.getElementById('contrasena')
    let contrasenaDos = document.getElementById('repetirContrasena')
    console.log(contrasenaUno.value);
    console.log(contrasenaDos.value);

    if (nombre.value == ''  || apellido.value == '' || email.value == '' || perfil.value == '' || contrasenaUno.value == '' || contrasenaDos.value == '') {
        alert('Todos los campos son obligatorios')
    } else{    
        if (contrasenaUno.value != contrasenaDos.value) {
        alert('la contraseña de ser igual')
        }else{
            console.log('creado')
            crearUsuarioNuevo(jwt);
        }
    }    
}



function validarDatosEditar(jwt, id) {
    console.log('validarDatosEditar');
    let contrasenaUno = document.getElementById('contrasena')
    let contrasenaDos = document.getElementById('repetirContrasena')
        if (contrasenaUno.value != contrasenaDos.value) {
        alert('la contraseña de ser igual')
        }else{
            let nombreEditar = document.getElementById('nombre');
            let apellidoEditar = document.getElementById('apellido');
            let emailEditar = document.getElementById('email');
            let perfilEditar = document.getElementById('perfil');
            if (nombreEditar.value == ''  || emailEditar.value == '' || apellidoEditar.value == '' || perfilEditar.value == 0) {
                alert('Todos los campos son obligatorios')
            } else{    
                console.log('editado')
                editarUsuario(jwt, id);
            }  
        }  
}