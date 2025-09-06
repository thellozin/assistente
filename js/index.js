// ----- MENU HAMBURGUER -----
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("header nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("active"));

// ----- VARIÁVEIS DE EDIÇÃO -----
let editandoRenda = null;
let editandoDespesa = null;
let editandoLembrete = null;

// ----- INICIALIZAÇÃO -----
window.onload = () => {
  carregarCategoriasDespesas();
  carregarCategoriasLembretes();
  mostrarRendas();
  mostrarDespesas();
  mostrarLembretes();
  calcularResumo();
};

// ----- FORMATAÇÃO DE DATAS -----
function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ====================== RENDAS ======================
function salvarRenda() {
  let nome = document.getElementById("rendaNome").value.trim();
  let valor = parseFloat(document.getElementById("rendaValor").value);
  if (!nome || isNaN(valor)) return;

  let rendas = JSON.parse(localStorage.getItem("rendas")) || [];
  if (editandoRenda !== null) {
    rendas[editandoRenda] = { nome, valor };
    editandoRenda = null;
  } else {
    rendas.push({ nome, valor });
  }

  localStorage.setItem("rendas", JSON.stringify(rendas));
  document.getElementById("rendaNome").value = "";
  document.getElementById("rendaValor").value = "";
  mostrarRendas();
  calcularResumo();
}

function mostrarRendas() {
  let rendas = JSON.parse(localStorage.getItem("rendas")) || [];
  let lista = document.getElementById("listaRendas");
  lista.innerHTML = "";
  rendas.forEach((r, i) => {
    lista.innerHTML += `<li>${r.nome} - R$ ${r.valor.toFixed(2)} 
      <button onclick="editarRenda(${i})">✏️</button> 
      <button onclick="removerRenda(${i})">❌</button></li>`;
  });
}

function editarRenda(i) {
  let rendas = JSON.parse(localStorage.getItem("rendas")) || [];
  document.getElementById("rendaNome").value = rendas[i].nome;
  document.getElementById("rendaValor").value = rendas[i].valor;
  editandoRenda = i;
}

function removerRenda(i) {
  if (!confirm("Tem certeza que deseja remover esta renda?")) return;
  
  let rendas = JSON.parse(localStorage.getItem("rendas")) || [];
  rendas.splice(i, 1);
  localStorage.setItem("rendas", JSON.stringify(rendas));
  mostrarRendas();
  calcularResumo();
}


// ====================== DESPESAS ======================
function salvarDespesa() {
  let nome = document.getElementById("despesaNome").value.trim();
  let valor = parseFloat(document.getElementById("despesaValor").value);
  let categoria = document.getElementById("despesaCategoria").value || "Outros";
  if (!nome || isNaN(valor)) return;

  let hoje = new Date().toISOString().split("T")[0];
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];

  if (editandoDespesa !== null) {
    let antiga = despesas[editandoDespesa];
    despesas[editandoDespesa] = {
      nome,
      valor,
      categoria,
      data: antiga.data || hoje,
      paga: antiga.paga || false
    };
    editandoDespesa = null;
  } else {
    despesas.push({ nome, valor, categoria, data: hoje, paga: false });
  }

  localStorage.setItem("despesas", JSON.stringify(despesas));
  document.getElementById("despesaNome").value = "";
  document.getElementById("despesaValor").value = "";
  document.getElementById("despesaCategoria").value = "";
  mostrarDespesas();
  calcularResumo();
}

function mostrarDespesas() {
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  let lista = document.getElementById("listaDespesas");
  lista.innerHTML = "";

  despesas.forEach((d, i) => {
    let status = d.paga ? "✅ Pago" : "❌ Em aberto";
    let botaoAcao = d.paga
      ? `<button onclick="desmarcarComoPaga(${i})">↩️ Desfazer</button>`
      : `<button onclick="marcarComoPaga(${i})">✔️ Pagar</button>`;

    lista.innerHTML += `<li>
      ${d.nome} - R$ ${d.valor.toFixed(2)} - ${d.categoria} - ${status}
      <button onclick="editarDespesa(${i})">✏️</button> 
      <button onclick="removerDespesa(${i})">🗑️</button>
      ${botaoAcao}
    </li>`;
  });
}

function marcarComoPaga(i) {
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  despesas[i].paga = true;
  localStorage.setItem("despesas", JSON.stringify(despesas));
  mostrarDespesas();
  calcularResumo();
}

function desmarcarComoPaga(i) {
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  despesas[i].paga = false;
  localStorage.setItem("despesas", JSON.stringify(despesas));
  mostrarDespesas();
  calcularResumo();
}

function editarDespesa(i) {
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  document.getElementById("despesaNome").value = despesas[i].nome;
  document.getElementById("despesaValor").value = despesas[i].valor;
  document.getElementById("despesaCategoria").value = despesas[i].categoria;
  editandoDespesa = i;
}

function removerDespesa(i) {
  if (!confirm("Tem certeza que deseja remover esta despesa?")) return;
  
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  despesas.splice(i, 1);
  localStorage.setItem("despesas", JSON.stringify(despesas));
  mostrarDespesas();
  calcularResumo();
}


// ----- CATEGORIAS DESPESAS -----
function adicionarCategoria() {
  const select = document.getElementById("despesaCategoria");
  const novaCategoriaInput = document.getElementById("novaCategoria");
  const novaCategoria = novaCategoriaInput.value.trim();
  if (!novaCategoria) return alert("Digite um nome para a categoria!");

  let categorias = JSON.parse(localStorage.getItem("categoriasDespesas")) || [
    "Alimentação","Transporte","Compras","Saúde","Pessoal","Assinaturas","Outros"
  ];

  if (categorias.some(cat => cat.toLowerCase() === novaCategoria.toLowerCase())) {
    return alert("Essa categoria já existe!");
  }

  categorias = categorias.filter(c => c !== "Outros");
  categorias.push(novaCategoria);
  categorias.sort();
  categorias.push("Outros");

  localStorage.setItem("categoriasDespesas", JSON.stringify(categorias));
  carregarCategoriasDespesas();
  novaCategoriaInput.value = "";
}

function carregarCategoriasDespesas() {
  const select = document.getElementById("despesaCategoria");
  let categorias = JSON.parse(localStorage.getItem("categoriasDespesas")) || [];
  select.innerHTML = "";
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function removerCategoria() {
  const select = document.getElementById("despesaCategoria");
  const categoria = select.value;
  if (!categoria || categoria === "Outros") return alert("Selecione uma categoria válida para remover.");

  select.remove(select.selectedIndex);

  let categorias = Array.from(select.options).map(opt => opt.value);
  localStorage.setItem("categoriasDespesas", JSON.stringify(categorias));

  select.value = "";
}

// ====================== LEMBRETES ======================
function salvarLembrete() {
  let texto = document.getElementById("lembrete").value.trim();
  let categoria = document.getElementById("lembreteCategoria").value || "Outros";
  let dataInput = document.getElementById("lembreteData").value;

  if (!texto) return alert("Digite um lembrete!");

  let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];
  if (editandoLembrete !== null) {
    let antiga = lembretes[editandoLembrete];
    lembretes[editandoLembrete] = {
      texto,
      categoria,
      data: dataInput || antiga.data || null
    };
    editandoLembrete = null;
  } else {
    lembretes.push({ texto, categoria, data: dataInput || null });
  }

  localStorage.setItem("lembretes", JSON.stringify(lembretes));
  mostrarLembretes();

  document.getElementById("lembrete").value = "";
  document.getElementById("lembreteData").value = "";
  document.getElementById("lembreteCategoria").value = "";

  if (dataInput) criarLinkEventoGoogleLocal(texto, categoria, dataInput);
}

function mostrarLembretes() {
  let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];
  let lista = document.getElementById("listaLembretes");
  lista.innerHTML = "";
  let hoje = new Date().toISOString().split("T")[0];

  lembretes.forEach((l, i) => {
    let status = "";
    let dataTexto = l.data ? formatarData(l.data) : "Sem data definida";
    if (l.data) {
      if (l.data < hoje) status = "⚠️ Vencido";
      else if (l.data === hoje) status = "📌 Hoje";
    }

    lista.innerHTML += `<li>${l.texto} - ${l.categoria} ${l.data ? "- " + dataTexto : ""} ${status}
      <button onclick="editarLembrete(${i})">✏️</button> 
      <button onclick="removerLembrete(${i})">❌</button>
    </li>`;
  });
}

function editarLembrete(i) {
  let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];
  document.getElementById("lembrete").value = lembretes[i].texto;
  document.getElementById("lembreteCategoria").value = lembretes[i].categoria;
  document.getElementById("lembreteData").value = lembretes[i].data || "";
  editandoLembrete = i;
}

function removerLembrete(i) {
  if (!confirm("Tem certeza que deseja remover este lembrete?")) return;
  
  let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];
  lembretes.splice(i, 1);
  localStorage.setItem("lembretes", JSON.stringify(lembretes));
  mostrarLembretes();
}


// ----- CATEGORIAS LEMBRETES -----
function adicionarCategoriaLembrete() {
  const select = document.getElementById("lembreteCategoria");
  const novaCategoriaInput = document.getElementById("novaCategoriaLembrete");
  const novaCategoria = novaCategoriaInput.value.trim();
  if (!novaCategoria) return alert("Digite um nome para a categoria!");

  let categorias = JSON.parse(localStorage.getItem("categoriasLembretes")) || [
    "Aniversário","Compras","Trabalho","Faculdade","Outros"
  ];

  if (categorias.some(cat => cat.toLowerCase() === novaCategoria.toLowerCase())) {
    return alert("Essa categoria já existe!");
  }

  categorias = categorias.filter(c => c !== "Outros");
  categorias.push(novaCategoria);
  categorias.sort();
  categorias.push("Outros");

  localStorage.setItem("categoriasLembretes", JSON.stringify(categorias));
  carregarCategoriasLembretes();
  novaCategoriaInput.value = "";
}

function carregarCategoriasLembretes() {
  const select = document.getElementById("lembreteCategoria");
  let categorias = JSON.parse(localStorage.getItem("categoriasLembretes")) || [];
  select.innerHTML = "";
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function removerCategoriaLembrete() {
  const select = document.getElementById("lembreteCategoria");
  const valor = select.value;
  if (!valor || valor === "Outros") return alert("Selecione uma categoria válida para remover.");

  select.remove(select.selectedIndex);
  let categorias = Array.from(select.options).map(opt => opt.value);
  localStorage.setItem("categoriasLembretes", JSON.stringify(categorias));
}

// ----- GOOGLE CALENDAR -----
function criarLinkEventoGoogleLocal(titulo, descricao, data) {
  const [ano, mes, dia] = data.split("-");
  const dtStart = `${ano}${mes}${dia}T090000`;
  const dtEnd = `${ano}${mes}${dia}T100000`;
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&details=${encodeURIComponent(descricao)}&dates=${dtStart}/${dtEnd}`;
  window.open(url, "_blank");
}

// ====================== RESUMO ======================
function calcularResumo() {
  let rendas = JSON.parse(localStorage.getItem("rendas")) || [];
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];

  let totalRendas = rendas.reduce((acc, r) => acc + r.valor, 0);
  let totalDespesasPagas = despesas.filter(d => d.paga).reduce((acc, d) => acc + d.valor, 0);
  let totalDespesasAbertas = despesas.filter(d => !d.paga).reduce((acc, d) => acc + d.valor, 0);
  let totalDespesas = totalDespesasPagas + totalDespesasAbertas;

  let saldoAtual = totalRendas - totalDespesasPagas;
  let saldoProjetado = totalRendas - totalDespesas;

  let corAtual = saldoAtual >= 0 ? "green" : "red";
  let corProjetado = saldoProjetado >= 0 ? "green" : "red";

  document.getElementById("resumo").innerHTML =
    `Total de rendas: R$ ${totalRendas.toFixed(2)}<br>` +
    `Total de despesas: R$ ${totalDespesas.toFixed(2)}<br>` +
    ` └ Pagas: R$ ${totalDespesasPagas.toFixed(2)} | Em aberto: R$ ${totalDespesasAbertas.toFixed(2)}<br>` +
    `Saldo atual: <span style="color:${corAtual}">R$ ${saldoAtual.toFixed(2)}</span><br>` +
    `Saldo projetado: <span style="color:${corProjetado}">R$ ${saldoProjetado.toFixed(2)}</span>`;
}
