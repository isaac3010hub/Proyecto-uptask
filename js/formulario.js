
eventListener();

function eventListener() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}


function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value;
        tipo = document.querySelector('#tipo').value;

    if (usuario === '' || password === '') {
        // la validacion falló
        swal({
            type: 'error',
            title: 'Error!',
            text: 'Ambos campos son obligatorios!'
        })
    } else {
        // Ambos campos son correctos, mandar ejecutar Ajax 

        // datos que se envian al servidor 
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        // crear el llamado ajax

        var xhr = new XMLHttpRequest();

        // abrir la conexión.

        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        // retorno de datos 

        xhr.onload = function() {
            if(this.status === 200) {
              var respuesta = JSON.parse(xhr.responseText);
console.log(respuesta);
              // si la respuesta es correcta 
              if(respuesta.respuesta  === 'correcto'){
                  //si e un nuevo usuaro

                  if(respuesta.tipo === 'crear'){
                      swal({    
                            title: 'Usuario Creado', 
                            text: 'El usuario  se Creó correctamente',
                            type: 'success'
                      });
                  }else if(respuesta.tipo === 'login'){
                    swal({    
                        title: 'Login correcto', 
                        text: 'Presiona Ok para abrir el dashboard',
                        type: 'success'
                  })
                  .then(resultado => {
                    if(resultado.value){
                        window.location.href='index.php?id_proyecto=2';
                    }
                  })

                  }
              }else{
                //When hay un error :VvVv
                 
                swal({
                    title: 'Error',
                    text: 'Hubo un error',
                    type: 'error'
                })
              }
            }
        }

        // Enviar la petición
        xhr.send(datos);


    }
}