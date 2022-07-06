///////////////////////////////////////////////////////////
//Proyecto final clase Javascript Paula Sierra Camada 30375
///////////////////////////////////////////////////////////


const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/////////////
// FORMS
//👋 Saludo nombre y apellido - Funciones asincronicas
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");

function nombreApellido() {
  const inputNombre = document.getElementById("nombre").value; //Input de origen - lo llena el usuario
  const inputApellido = document.getElementById("apellido").value; //Input de destino - lo llena el usuario
  setTimeout(() => {
    document.getElementById("salidaInput").innerHTML =
      "👋 ¡Gracias por visitarnos! Estamos para servirte " +
      "<b>" +
      inputNombre +
      " " +
      inputApellido +
      "</b>";
  }, 1000);
}

//💌 Formulario para enviar factura al email del usuario
const btn = document.getElementById("buttonEmail");
// Metodo del DOM addeventlistener para que esté atento a la interacción del submit
document
  .getElementById("formFactura")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    btn.value = "Enviando...";
    const serviceID = "default_service";
    const templateID = "template_khiiylr";

    emailjs.sendForm(serviceID, templateID, this).then(
      () => {
        // EXITO
        btn.value = "Enviarme mi factura";
        // alerta sweet alert de exito
        // Swal.fire(
        //   "Factura enviada correctamente!",
        //   "Revisa tu correo EN SERIO TE DEBO LLEGAR UN EMAIL",
        //   "success"
        let timerInterval
        Swal.fire({
          title: 'Estamos enviando tu factura al correo',
          html: 'Esta acción toma un poco de tiempo. Me cerraré en <b></b> milisegundos.',
          timer: 10000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 2000)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('Fui cerrado por el timer')
          }
        });
      },
      (err) => {
        // ERROR
        btn.value = "Enviarme mi factura";
        // alerta sweet alert de error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Hubo un error, vuelve a llenar tus datos",
        });
      }
    );
  });
// cierre formulario
/////////////


/////////////
//APIs
// GET post - Funcion para recibir info de una API de libros
function obtenerLibros() {
  const URLGET = "https://api.itbook.store/1.0/search/java"; //End point - siempre en comillas - se crea una constante para reusarlo sin tantas letras en el futuro. Solo URLGET
  fetch(URLGET)
    .then((resultado) => resultado.json()) //fin primera promesa-comienzo segunda promesa
    .then((data) => {
      let libros = data.books; //guardo el array de libros . accedes asi a lo unico que te interesa
      //Arriba ya trajo la info del api.
      //Abajo es para pintar la info en el DOM o en el html.
      libros.forEach((libro) => {
        //Abajo es como se pinta un tabla en HTML.
        document.querySelector("#libros").innerHTML += ` 
          <div class="tm-container col-md-3 card shadow mb-1 bg-dark rounded" style="width: 20rem">
            <h5 class="card-title pt-2 text-center text-muted">${libro.title}</h5>
            <img src="${libro.image}" class="card-img-top" alt="...">
            <div class="card-body">
              <p class="card-text text-white-50 description">${libro.subtitle}</p>
            </div>
            <div class="d-grid gap-2">
              <button  class="btn btn-secondary button" id='btn'>DESCARGAR</button>
            </div>
          </div>
        `;
        //Evento para cada boton
        document.querySelector(`#btn`).onclick= function() {
          Swal.fire('¡Descargado!', '<b> Haz descargado exitosamente </b>', 'success');
        };
      });
    });
}

obtenerLibros(); // IMPORTANTE DECLARARLA O NO SE HARA NADA.
/////////////


/////////////
// JSON
// Seccion Libros Mas Vendidos
let librosMasVendidosJSON = [];

//GETJSON de productos.json
async function obtenerJSON() {
  const URLJSON="/librosMasVendidosJSON.json"
  const resp=await fetch("librosMasVendidosJSON.json")
  const data= await resp.json()
  librosMasVendidosJSON = data;
  renderizarProductos();
}
obtenerJSON();


function renderizarProductos() {
//renderizamos los productos 
  for (const prod of librosMasVendidosJSON) {
    document.getElementById("librosVendidos").innerHTML +=  `
      <div class="tm-container col-md-3 card shadow mb-1 bg-dark rounded" style="width: 20rem">
        <h5 class="card-title pt-2 text-center text-muted">${prod.title}</h5>
        <img src="${prod.img}" class="card-img-top" alt="...">
          <div class="card-body">
            <p class="card-text text-white-50 description">${prod.resumen}</p>
            <h5 class="text-muted">Precio: <span class="precio">$ ${prod.precio}</span></h5>
            <div class="d-grid gap-2">
              <button  class="btn btn-secondary button" id='btn${prod.id}'>Añadir a Carrito</button>
            </div>
          </div>
      </div>`;
        } 
        //EVENTOS
        for (const prod of librosMasVendidosJSON) {
          //Evento para cada boton
          document.querySelector(`#btn${prod.id}`).onclick= function() {
            agregarACarrito(prod);
          };
        }
} 
/////////////

/////////////
//Funcion para agregar a carrito

class ProductoCarrito {
  constructor(objProd) {
      this.id = objProd.id;
      this.foto = objProd.img;
      this.nombre = objProd.title;
      this.precio = objProd.precio;
      this.cantidad = 1;
  }
}

function agregarACarrito(productoNuevo) {
  let encontrado = carrito.find(p => p.id == productoNuevo.id);
  if (encontrado == undefined) {
      let prodACarrito = new ProductoCarrito(productoNuevo);
      carrito.push(prodACarrito);
      Swal.fire(
          'Nuevo producto agregado al carro',
          productoNuevo.nombre,
          'success'
      );
      //agregamos una nueva fila a la tabla de carrito
      document.querySelector("#tablabody").innerHTML+=(`
          <tr id='fila${prodACarrito.id}'>
          <td> ${prodACarrito.id} </td>
          <td> ${prodACarrito.nombre}</td>
          <td><img src="${prodACarrito.foto}" class="card-img-top img-thumbnail" style="width: 15%;" alt="..."></td>
          <td id='${prodACarrito.id}'> ${prodACarrito.cantidad}</td>
          <td>$ ${prodACarrito.precio}</td>
          <td> <button class='btn btn-light bg-danger text-light' onclick='eliminar(${prodACarrito.id})'>🗑️ X </button>`);
          addLocalStorage();
          document.querySelector("#gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
  } else {
      //pido al carro la posicion del producto 
      let posicion = carrito.findIndex(p => p.id == productoNuevo.id);
      carrito[posicion].cantidad += 1;
      Swal.fire(
        'Nuevo producto agregado al carro',
        productoNuevo.nombre,
        'success'
    );
      //con querySelector falla
      document.getElementById(productoNuevo.id).innerText=carrito[posicion].cantidad;
      addLocalStorage();
      document.querySelector("#gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
  }
}

function mostrardesdeStorage(){
  carrito.map(item => {
    document.querySelector("#tablabody").innerHTML+=(`
          <tr id='fila${item.id}'>
          <td> ${item.id} </td>
          <td> ${item.nombre}</td>
          <td><img src="${item.foto}" class="card-img-top img-thumbnail" style="width: 15%;" alt="..."></td>
          <td id='${item.id}'> ${item.cantidad}</td>
          <td> $ ${item.precio}</td>
          <td> <button class='btn btn-light bg-danger text-light' onclick='eliminar(${item.id})'>🗑️ X </button>`);
  });
  document.querySelector("#gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
}
mostrardesdeStorage();


// Funcion para sacar el total de la compra del carrito
function calcularTotal() {
  let suma = 0;
  for (const elemento of carrito) {
      suma = suma + (elemento.precio * elemento.cantidad);
  }
  return suma;
}


function eliminar(id){
    let indice=carrito.findIndex(prod => prod.id==id);
    carrito.splice(indice,1);
    let fila=document.getElementById(`fila${id}`);
    document.getElementById("tablabody").removeChild(fila);
    document.querySelector("#gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
    addLocalStorage();
    // alerta de removido
    Swal.fire('Borrado', 'El objeto ha salido del carrito', 'success') 
}

renderizarProductos();


// Funcion para agregar al local storage y mantener los datos del usuario guardados
function addLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

////

//Funcion final - Boton Comprar
document.getElementById("buttonComprar").addEventListener("click", btnBuy);

function btnBuy() {
  Swal.fire({
    title: '¿Quieres proceder con la compra?',
    showDenyButton: true,
    confirmButtonText: 'Si, comprar',
    denyButtonText: `No, cancelar`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire('¡Comprado!', '📩 <b> Enviate la factura al correo ingresando tus datos en el formulario de abajo </b>', 'success')
    } else if (result.isDenied) {
      Swal.fire('Cancelado', 'Tu compra no se realizó y tu bolsillo quedo lleno ;)', 'error')
    }
  })
}
