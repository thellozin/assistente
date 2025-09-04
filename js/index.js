// Menu hamburguer
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("header nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("active"));

// Variáveis de edição
let editandoRenda = null;
let editandoDespesa = null;
let editandoLembrete = null;

// Inicialização
window.onload = () => {
  mostrarRendas();
  mostrarDespesas();
  mostrarLembretes();
  calcularResumo();
};

// Função para formatar datas em dd/mm/yyyy
function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ----- RENDAS -----
function salvarRenda() {
  let nome = document.getElementById("rendaNome").value;
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
    lista.innerHTML += `<li>${r.nome} - R$ ${r.valor} 
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
  let rendas = JSON.parse(localStorage.getItem("rendas")) || [];
  rendas.splice(i, 1);
  localStorage.setItem("rendas", JSON.stringify(rendas));
  mostrarRendas();
  calcularResumo();
}

// ----- DESPESAS -----
function salvarDespesa() {
  let nome = document.getElementById("despesaNome").value;
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
      ${d.nome} - R$ ${d.valor} - ${d.categoria} - ${status}
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
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  despesas.splice(i, 1);
  localStorage.setItem("despesas", JSON.stringify(despesas));
  mostrarDespesas();
  calcularResumo();
}

// ----- LEMBRETES -----
function salvarLembrete() {
  let texto = document.getElementById("lembrete").value;
  let categoria = document.getElementById("lembreteCategoria").value || "Outros";
  let data = document.getElementById("lembreteData").value || null;

  if (!texto) return;

  let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];

  if (editandoLembrete !== null) {
    let antiga = lembretes[editandoLembrete];
    lembretes[editandoLembrete] = {
      texto,
      categoria,
      data: data || antiga.data || null
    };
    editandoLembrete = null;
  } else {
    lembretes.push({ texto, categoria, data });
  }

  localStorage.setItem("lembretes", JSON.stringify(lembretes));
  document.getElementById("lembrete").value = "";
  document.getElementById("lembreteData").value = "";
  document.getElementById("lembreteCategoria").value = "";
  mostrarLembretes();
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
  editandoLembrete = i;
}

function removerLembrete(i) {
  let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];
  lembretes.splice(i, 1);
  localStorage.setItem("lembretes", JSON.stringify(lembretes));
  mostrarLembretes();
}

// ----- RESUMO -----
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
    `Total de rendas: R$ ${totalRendas}<br>` +
    `Total de despesas: R$ ${totalDespesas}<br>` +
    ` └ Pagas: R$ ${totalDespesasPagas} | Em aberto: R$ ${totalDespesasAbertas}<br>` +
    `Saldo atual: <span style="color:${corAtual}">R$ ${saldoAtual}</span><br>` +
    `Saldo projetado: <span style="color:${corProjetado}">R$ ${saldoProjetado}</span>`;
}
