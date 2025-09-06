const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("header nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

let editandoItem = null;

function adicionarItem() {
  let nome = document.getElementById("itemNome").value;
  let quantidade = parseInt(document.getElementById("itemQuantidade").value);
  let preco = parseFloat(document.getElementById("itemPreco").value);

  if (!nome || isNaN(quantidade) || isNaN(preco)) return;

  let lista = JSON.parse(localStorage.getItem("listaCompras")) || [];

  if (editandoItem !== null) {
    lista[editandoItem] = { nome, quantidade, preco, comprado: false };
    editandoItem = null;
  } else {
    lista.push({ nome, quantidade, preco, comprado: false });
  }

  localStorage.setItem("listaCompras", JSON.stringify(lista));
  document.getElementById("itemNome").value = "";
  document.getElementById("itemQuantidade").value = "";
  document.getElementById("itemPreco").value = "";
  mostrarListaCompras();
}

function mostrarListaCompras() {
  let lista = JSON.parse(localStorage.getItem("listaCompras")) || [];
  let ul = document.getElementById("listaCompras");
  ul.innerHTML = "";

  let total = 0;

  lista.forEach((item, i) => {
    total += item.quantidade * item.preco;
    ul.innerHTML += `
      <li>
        <input type="checkbox" ${item.comprado ? "checked" : ""} onclick="marcarComprado(${i})">
        ${item.nome} - ${item.quantidade} x R$ ${item.preco.toFixed(2)} = R$ ${(item.quantidade * item.preco).toFixed(2)}
        <div class="botoes-item">
          <button onclick="editarItem(${i})">✏️</button>
          <button onclick="removerItem(${i})">❌</button>
        </div>
      </li>
    `;
  });

  document.getElementById("totalCompras").innerHTML = `<b>Total:</b> R$ ${total.toFixed(2)}`;
}

function marcarComprado(i) {
  let lista = JSON.parse(localStorage.getItem("listaCompras")) || [];
  lista[i].comprado = !lista[i].comprado;
  localStorage.setItem("listaCompras", JSON.stringify(lista));
  mostrarListaCompras();
}

function editarItem(i) {
  let lista = JSON.parse(localStorage.getItem("listaCompras")) || [];
  document.getElementById("itemNome").value = lista[i].nome;
  document.getElementById("itemQuantidade").value = lista[i].quantidade;
  document.getElementById("itemPreco").value = lista[i].preco;
  editandoItem = i;
}

function removerItem(i) {
  if (!confirm("Tem certeza que deseja remover este item da lista de compras?")) return;

  let lista = JSON.parse(localStorage.getItem("listaCompras")) || [];
  lista.splice(i, 1);
  localStorage.setItem("listaCompras", JSON.stringify(lista));
  mostrarListaCompras();
}


window.onload = mostrarListaCompras;
