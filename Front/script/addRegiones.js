function addRegion() {
    let jwt = sessionStorage.getItem("jwt");
    crearRegion(jwt);
}

let respuestaCrear = document.getElementById("responseCrearRegion");
//crear usuario
function crearRegion(jwt) {
    let region=document.getElementById("region");
    if (jwt != null) {
       fetch("http://localhost:7000/crearRegion", {
            method: 'POST',
            body:`{"nombre":"${region.value}"}`,
        headers:{"Content-Type":"application/json"}
    }).then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                console.log(data);
                location.reload();
            });
        } else {
            respuestaCrear.textContent = `La región ya esta registrado intenta uno diferente`;
            }
        }).catch(error => {
            console.log(error);
            respuestaCrear.textContent = "Se presento un error intenta nuevamente";
        });
       
    } 
};

