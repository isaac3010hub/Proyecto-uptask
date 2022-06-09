
eventListeners();
// Lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');
        
function eventListeners() {
    // boton para crear proyecto 
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregaTarea);

}

function nuevoProyecto(e) {
    e.preventDefault();
    console.log('Presionaste en nuevo proyecto');

    // Crear un <input> para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // seleccionar el ID con el nuevoProyecto 
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
    
    // al presionar enter crear el proyecto 
    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.which || e.keyCode;
        if(tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
            console.log("precionaste enter")
        }
    });
}
function guardarProyectoDB(nombreProyecto){
    // Crear llamado ajax
    var xhr = new XMLHttpRequest();
    // enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion','crear');
    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
    // En la carga 
    xhr.onload = function() {
        if(this.status === 200) {
            // obteer datos de la respuesta 
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombreProyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo;
                resultado = respuesta.respuesta;
            // Comprobar la insercion 
            if(resultado === 'correcto') {
                // fue exitoso
                if(tipo === 'crear') {
                    //Se creo un nuevo proyecto
                    // inyectar en el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML =`
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>
                        `;
                        // agregar al html
                        listaProyectos.appendChild(nuevoProyecto);
                        // enviar alerta 
                        swal({
                            title: 'Proyecto Creado',
                            text: 'El Proyecto:' + proyecto + ' se creo correctamente',
                            type: 'success'
                        })
                        .then(resultado => {
                            // redireccionar a la nueva URL
                            if(resultado.value) {
                                window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                            }
                            })
                        } else {
                    // Se actualizo o se elimino
                }
            } else {
                //hubo un error
                swal({
                    type: 'error',
                    title: 'Error!',
                    text: 'Hubo un error!'
                }) 
            }
        }
    }
    // Enviar el Request
    xhr.send(datos);
}   
   

//agregar una nueva tarea al proyecto actual

function agregaTarea(e){
    e.preventDefault();
    
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    //validar que el campo tenga algo escrito

    if(nombreTarea === ''){
        swal({
            title: 'Error',
            text: 'Una Tarea no puede ir Vacia',
            type: 'error' 
        })
    }else{
        // si la tarea tiene algo, insertar el PHP_SELF

        //crear llamado a ajax
        var xhr = new XMLHttpRequest();

        //crear formdata
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value );

        //abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        //ejecutarlo y respuesta
        xhr.onload = function() {
            if(this.status === 200){
                //todo correcto y yo que me alegro
                var respuesta = JSON.parse(xhr.responseText);
               
                var resultado = respuesta.respuesta,
                    tarea = respuesta,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if(respuesta.respuesta === 'correcto'){
                    //se agregp correctamente
                    if(tipo === 'crear'){
                        //lanzar la alerta
                        swal({
                            type: 'success',
                            title: 'Tarea Creada',
                            text: 'La Tarea' + tarea + ' se creo Correctamente'
                        });

                        //construir el template
                        var nuevaTarea = document.createElement('li');

                        //agregamos el ID
                        nuevaTarea.id = 'tarea:' + id_insertado;

                        //agregar la clase tarea
                        nuevaTarea.classList.add('tarea');

                        //insertar en el html
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                        //agregar  al html
                        var listado = document.querySelector('.listado-pendiente ul');
                        listado.appendChild(nuevaTarea);

                        //limpiar formulario
                            document.querySelector('.agregar-tarea').reset();
                    }
                }else{
                    //hubo un error
                    swal({
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                    })
                }
            }
        }

        //Enviar la consulta
        xhr.send(datos);
    }
}