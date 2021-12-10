class producto {
  constructor(nombre, codigo, categoria, cantidad, precio, url) {
    this.nombre = nombre;
    this.codigo = codigo;
    this.categoria = categoria;
    this.cantidad = cantidad;
    this.precio = precio;
    this.url = url;
  }
}

let catalogo = document.querySelector(".catalogo");
let codigo = document.getElementById("codigo");
let teclas = document.querySelectorAll(".btn-tecla");
let limpiar = document.getElementById("limpiar");
let comprar = document.getElementById("comprar");
let formAgregarProducto = document.getElementById("form-agregarProducto");
let formAddMoreProducto = document.getElementById("form-addMoreProducto");
let formDelete = document.getElementById("form-delete");
let sobrante = document.getElementById("sobrante");

let productos = [
  {
    nombre: "papitas",
    codigo: 1234,
    categoria: "lonchera",
    cantidad: 4,
    precio: 1200,
    url: "img/papitas.jpg",
  },
  {
    nombre: "chocolate",
    codigo: 1584,
    categoria: "lonchera",
    cantidad: 8,
    precio: 1000,
    url: "img/jet.jpg",
  },
  {
    nombre: "gaseosa",
    codigo: 4444,
    categoria: "Bebida",
    cantidad: 5,
    precio: 1500,
    url: "img/gaseosa.jpg",
  },
  {
    nombre: "golosa",
    codigo: 1444,
    categoria: "lonchera",
    cantidad: 9,
    precio: 1400,
    url: "img/golosa.jpg",
  },
];

/********************************LocalStorage********************************/
const guardarLocalStorage = () => {
  localStorage.setItem("productos", JSON.stringify(productos));
  obtenerLocalStorage();
};

const obtenerLocalStorage = () => {
  catalogo.innerHTML = "";
  productos = JSON.parse(localStorage.getItem("productos"));
  if (productos === null) {
    productos = [];
  } else {
    productos.map((p) => {
      const carta = document.createElement("div");

      if (p.cantidad == 0 || p.cantidad < 0) {
        carta.innerHTML = "";
      } else {
        carta.innerHTML = `
      <div class="card producto-tarjeta" style="width: 15rem; margin: 20px;">
      <img src=${p.url} class="card-img-top img-tarjeta">
      <div class="card-body">
      
       <p><b>Nombre:</b> ${p.nombre}</p>
       <p><b>Codigo:</b> ${p.codigo}</p>
       <p><b>Categoria:</b> ${p.categoria}</p>
       <p><b>Cantidad:</b> ${p.cantidad}</p>
       <p><b>Precio:</b> ${p.precio}</p>
      </div>
      <button class="button-comprar">Comprar</button>
        </div>
        `;
      }

      catalogo.appendChild(carta);
    });
  }
};

/********************************LocalStorage********************************/

//guardarLocalStorage();

teclas.forEach((t) => {
  t.addEventListener("click", (e) => {
    codigo.value += e.target.innerHTML;
  });
});

// window.addEventListener("click", (e) => {
//   console.log(e.target);
// });

limpiar.addEventListener("click", () => {
  codigo.value = "";
});

catalogo.addEventListener("click", (e) => {
  let codigoProducto =
    e.path[1].childNodes[3].childNodes[3].childNodes[1].textContent;

  codigo.value = codigoProducto;
});

document.addEventListener("DOMContentLoaded", obtenerLocalStorage);

comprar.addEventListener("click", () => {
  if (codigo.value === "") {
    alert("rellene el codigo");
  } else {
    const producto = productos.find((p) => p.codigo == codigo.value);

    if (!producto) {
      alert("El producto no existe");
    } else {
      let monedas = document.getElementById("monedas").value;
      let validarMonedas = false;
      let arrayMonedas = monedas.split(",");
      for (let i = 0; i < arrayMonedas.length; i++) {
        if (
          arrayMonedas[i] != 100 &&
          arrayMonedas[i] != 200 &&
          arrayMonedas[i] != 500
        ) {
          validarMonedas = true;
        }
      }
      if (validarMonedas) {
        alert("solo se admiten monedas de 100,200 y 500");
      } else {
        let dinero = 0;
        for (let i = 0; i < arrayMonedas.length; i++) {
          arrayMonedas[i] = parseInt(arrayMonedas[i]);
          dinero += arrayMonedas[i];
        }

        if (dinero < producto.precio) {
          alert("por favor ingrese el dinero correspondiente");
        } else if (dinero == producto.precio) {
          producto.cantidad--;
        } else if (dinero > producto.precio) {
          sobrante.value = dinero - producto.precio;

          setTimeout(() => {
            sobrante.value = "";
          }, 5000);

          producto.cantidad--;
        }
      }

      guardarLocalStorage();
    }
  }
  monedas.value = "";
});

let img = document.getElementById("img");
let urlFile;

img.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    urlFile = reader.result;
  });
  reader.readAsDataURL(this.files[0]);
});

formAgregarProducto.addEventListener("submit", (e) => {
  let nombre = document.getElementById("nombre").value;
  let codigo = document.getElementById("newCodigoProducto").value;
  let categoria = document.getElementById("categoria").value;
  let cantidad = document.getElementById("cantidad").value;
  let precio = document.getElementById("precio").value;

  let codigoNumero = parseInt(codigo);
  let cantidadNumero = parseInt(cantidad);
  let precioNumero = parseInt(precio);
  let validarExistencia = false;
  for (let i = 0; i < productos.length; i++) {
    if (codigoNumero === productos[i].codigo) {
      validarExistencia = true;
    }
  }
  if (validarExistencia) {
    alert("El codigo ya existe");
    formAgregarProducto.reset();
  } else {
    const newProducto = new producto(
      nombre,
      codigoNumero,
      categoria,
      cantidadNumero,
      precioNumero,
      urlFile
    );
    productos.push(newProducto);
    guardarLocalStorage();

    formAgregarProducto.reset();
  }
  e.preventDefault();
});

formAddMoreProducto.addEventListener("submit", (e) => {
  let codigoAdd = document.getElementById("editarCantidad").value;
  let cantidad = document.getElementById("cantidadAdd").value;

  let codigoNumero = parseInt(codigoAdd);
  let cantidadNumero = parseInt(cantidad);

  const producto = productos.find((p) => p.codigo === codigoNumero);

  if (!producto) {
    alert("el producto no existe");
  } else {
    producto.cantidad += cantidadNumero;
    guardarLocalStorage();
  }
  formAddMoreProducto.reset();
  e.preventDefault();
});

formDelete.addEventListener("submit", (e) => {
  let codigoEliminar = document.getElementById("EliminarProducto").value;
  let codigoNumero = parseInt(codigoEliminar);
  let indexArray;

  const producto = productos.find((p) => p.codigo === codigoNumero);

  if (!producto) {
    alert("el producto no existe");
  } else {
    productos.forEach((p, i) => {
      if (p.codigo === producto.codigo) {
        indexArray = i;
      }
    });
    productos.splice(indexArray, 1);
    guardarLocalStorage();
  }
  e.preventDefault();
});
