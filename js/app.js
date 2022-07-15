// Variables
const formulario = document.querySelector('#agregar-gasto');
const lista = document.querySelector('#gastos ul');
const btnEditar = document.querySelector('.btn-secondary');

//Eventos
cargarEventListeners();

function cargarEventListeners(){
    document.addEventListener('DOMContentLoaded', cargarPresupuesto);
    formulario.addEventListener('submit', validarFormulario);
    btnEditar.addEventListener('click', editarPresupuesto);
};

//Clases
class UI{
    
    mostrarPresupuesto(cantidad){

        const { total, restante } = cantidad;

        document.querySelector('#total').textContent = total;
        document.querySelector('#restante').textContent = restante;

    };

    mostrarAlerta(tipo, mensaje){

        const div = document.createElement('div');
        div.textContent = mensaje;
        div.classList.add('alert', 'text-center');

        if(tipo === 'error'){
            div.classList.add('alert-danger');
        }else{
            div.classList.add('alert-success')
        };

        document.querySelector('.contenido').insertBefore(div, formulario);
        setTimeout(() => {
            div.remove();
        }, 3000)
    };

    mostrarListadoGastos(gastos){
        //Clases:'list-group-item d-flex justify-content-between aling-items-center'
        this.limpiarHTML();
        gastos.forEach((gasto) => {

            const nuevoGasto = document.createElement('li');
            const { nombre, cantidad, id } = gasto;

            //Crear HTML
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.innerHTML = `
                ${nombre} <span class="badge badge-primary badge-pill">$${cantidad}</span>
            `
            //Crear boton Eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnEliminar.innerHTML = 'Borrar &times;'

            //EventDelegation
            btnEliminar.onclick = (e) => {

                btnEliminar.remove();
                nuevoGasto.remove();

                //Actualizar restante
                presupuesto.restante += cantidad;
                this.actualizaRestante(presupuesto.total, presupuesto.restante);

                eliminarGasto(id);

            };
            //--------------

            lista.appendChild(nuevoGasto);
            nuevoGasto.appendChild(btnEliminar);

        });

    };
    
    actualizaRestante(total, restante){

        if(restante > (total*0.25) && restante < (total*0.6)){
            document.querySelector('.restante').classList.remove('alert-success', 'alert-danger');
            document.querySelector('.restante').classList.add('alert-warning');
        }else if(restante < total*0.25){
            document.querySelector('.restante').classList.remove('alert-success', 'alert-warning');
            document.querySelector('.restante').classList.add('alert-danger');
        }else{
            document.querySelector('.restante').classList.remove('alert-danger', 'alert-warning');
            document.querySelector('.restante').classList.add('alert-success');
        };

        document.querySelector('#restante').textContent = restante;
    };

    estadoBtnAgregar(){

        if(presupuesto.restante < 0){
            document.querySelector('button[type=submit]').disabled = true;
            ui.mostrarAlerta('error', 'Presupuesto agotado');
        }else{
            document.querySelector('button[type=submit]').disabled = false;
        };

    };

    limpiarHTML(){

        while(lista.firstChild){
            lista.removeChild(lista.firstChild);
        };

    };

};

class Presupuesto{

    constructor(total){

        this.total = total;
        this.restante = total;
        this.gastos = [];

    };

    insertarGasto(gasto){
        //Convierto cantidad en número
        gasto.cantidad = Number(gasto.cantidad);
        
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();

    };

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante =  this.total - gastado;
        console.log(this.restante);
    };

    eliminarGasto(id){
        console.log(id);
    };

};

//Instacias
const ui = new UI();
let presupuesto;


//Funciones
function cargarPresupuesto(){
    const presupuestoUsuario = Number(prompt('¿Cúal es su presupuesto?'));
    
    if(presupuestoUsuario === '' || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        //recargar pagina sino cumple la validación
        alert('Dato inválido, inténtalo nuevamente');
        window.location.reload();
        return;
    };

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.mostrarPresupuesto(presupuesto);
    
};

function validarFormulario(e){
    e.preventDefault();
    
    const nombre = document.querySelector('#gasto').value;
    const cantidad = document.querySelector('#cantidad').value;

    if(nombre === '' || cantidad === ''){

        ui.mostrarAlerta('error', 'Todos los campos son obligatorios');
        return;

    }else if(isNaN(cantidad) || cantidad <= 0){

        ui.mostrarAlerta('error', 'Valor inválido');
        return;

    };

    //Crea Object Literal con nombre y cantidad para representar el gasto
    const gasto = {nombre, cantidad, id:Date.now()};

    presupuesto.insertarGasto(gasto);
    ui.mostrarAlerta('success', 'Datos ingresados correctamente');
    ui.mostrarListadoGastos(presupuesto.gastos);
    ui.actualizaRestante(presupuesto.total, presupuesto.restante);
    ui.estadoBtnAgregar();
    formulario.reset();

};

function eliminarGasto(id){

    const gastosActualizado = presupuesto.gastos.filter( (gasto) => {

        if(gasto.id === id){
            return gasto;
        };
        return false;
    });
    
    presupuesto.gastos = gastosActualizado;

    ui.estadoBtnAgregar();
};

function editarPresupuesto(e){
    let guardarGastos = presupuesto.gastos;

    cargarPresupuesto();
    presupuesto.gastos = guardarGastos;
    presupuesto.calcularRestante();
    
    ui.actualizaRestante(presupuesto.total, presupuesto.restante);
    ui.mostrarListadoGastos(presupuesto.gastos);
};