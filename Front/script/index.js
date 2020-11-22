
function login() {
    let usuario=document.getElementById("idEmail");
    let contrasena=document.getElementById("password");
    let respuestaLogin = document.getElementById("responseLogin");
    console.log(usuario.value);
    sessionStorage.clear();
    fetch('http://localhost:7000/login',
    {
        method:'POST',
        body:`{"usuario":"${usuario.value}","contrasena":"${contrasena.value}"}`,
        headers:{"Content-Type":"application/json"}
    }).then(res=>{
            if (res.status == 200) {
                res.json().then(data => {
                console.log(data);
                //alert(data);
                sessionStorage.setItem("jwt", data);
                let user = parseJwt(data);
                location.href = "./contactos.html";
                });
            }
            else {
                contrasena.value = "";
                respuestaLogin.innerHTML = `<i class="fas fa-times" id="advertencia"></i> Usuario o Contraseña incorrecta`;
            }
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
