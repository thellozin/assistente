// Menu hamburguer
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("header nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("active"));

let editandoMeta = null;

// ----- METAS -----
function salvarMeta() {
  let nome = document.getElementById("metaNome").value;
  let valor = parseFloat(document.getElementById("metaValor").value);
  let dataFinalInput = document.getElementById("metaData").value;
  let data = dataFinalInput ? dataFinalInput : null;

  if (!nome || isNaN(valor)) return;

  let metas = JSON.parse(localStorage.getItem("metas")) || [];

  if (editandoMeta !== null) {
    metas[editandoMeta] = { ...metas[editandoMeta], nome, valor, data };
    editandoMeta = null;
  } else {
    metas.push({ nome, valor, data, depositos: [] });
  }

  localStorage.setItem("metas", JSON.stringify(metas));
  document.getElementById("metaNome").value = "";
  document.getElementById("metaValor").value = "";
  document.getElementById("metaData").value = "";
  mostrarMetas();
}

function mostrarMetas() {
  let metas = JSON.parse(localStorage.getItem("metas")) || [];
  let lista = document.getElementById("listaMetas");
  lista.innerHTML = "";

  let totalJuntado = 0;
  let totalMeta = 0;

  metas.forEach((m, i) => {
    let totalDepositos = m.depositos.reduce((a, d) => a + d.valor, 0);
    let progresso = Math.min((totalDepositos / m.valor) * 100, 100).toFixed(1);

    totalJuntado += totalDepositos;
    totalMeta += m.valor;

    let depositosHTML = m.depositos.map((d, j) =>
      `<li>+ R$ ${d.valor} (${d.data}) 
         <button onclick="removerDeposito(${i}, ${j})">❌</button>
      </li>`).join("");

    lista.innerHTML += `
      <li>
        <b>${m.nome}</b> - Meta: R$ ${m.valor} <br>
        ${m.data ? "Data final: " + m.data : "Sem prazo definido"} <br>
        <progress value="${progresso}" max="100"></progress> ${progresso}% (R$ ${totalDepositos})<br>
        
        <input id="depositoValor${i}" type="number" placeholder="Valor depósito">
        <button onclick="adicionarDeposito(${i})">+ Depositar</button>
        
        <div class="depositos"><ul>${depositosHTML}</ul></div>

        <button onclick="editarMeta(${i})">✏️ Editar</button>
        <button onclick="removerMeta(${i})">❌ Remover</button>
      </li><hr>
    `;
  });

  // atualizar resumo geral
  let falta = totalMeta - totalJuntado;
  document.getElementById("resumoGeral").innerHTML =
    `<b>Total Juntado:</b> R$ ${totalJuntado} | 
     <b>Total de Metas:</b> R$ ${totalMeta} | 
     <b>Falta:</b> R$ ${falta}`;

  atualizarGrafico(metas);
}

// ----- EDIÇÃO / REMOÇÃO DE METAS -----
function editarMeta(i) {
  let metas = JSON.parse(localStorage.getItem("metas")) || [];
  document.getElementById("metaNome").value = metas[i].nome;
  document.getElementById("metaValor").value = metas[i].valor;
  document.getElementById("metaData").value = metas[i].data ? metas[i].data : "";
  editandoMeta = i;
}

function removerMeta(i) {
  let metas = JSON.parse(localStorage.getItem("metas")) || [];
  metas.splice(i, 1);
  localStorage.setItem("metas", JSON.stringify(metas));
  mostrarMetas();
}

// ----- DEPÓSITOS -----
function adicionarDeposito(i) {
  let valor = parseFloat(document.getElementById("depositoValor" + i).value);
  if (isNaN(valor)) return;

  let hoje = new Date();
  let dia = String(hoje.getDate()).padStart(2, '0');
  let mes = String(hoje.getMonth() + 1).padStart(2, '0');
  let ano = hoje.getFullYear();
  let dataFormatada = `${dia}/${mes}/${ano}`;

  let metas = JSON.parse(localStorage.getItem("metas")) || [];
  metas[i].depositos.push({ valor, data: dataFormatada });
  localStorage.setItem("metas", JSON.stringify(metas));
  mostrarMetas();
}

function removerDeposito(i, j) {
  let metas = JSON.parse(localStorage.getItem("metas")) || [];
  metas[i].depositos.splice(j, 1);
  localStorage.setItem("metas", JSON.stringify(metas));
  mostrarMetas();
}

// ----- GRÁFICO DE METAS -----
let chartMetas = null;

function atualizarGrafico(metas) {
  const ctx = document.getElementById("graficoMetas").getContext("2d");
  const labels = metas.map(m => m.nome);
  const valores = metas.map(m => m.depositos.reduce((a, d) => a + d.valor, 0));
  const metasTotais = metas.map(m => m.valor);

  if (chartMetas) chartMetas.destroy();

  chartMetas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Juntado', data: valores, backgroundColor: '#36A2EB' },
        { label: 'Meta', data: metasTotais, backgroundColor: '#FF6384' }
      ]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

// carregar na entrada
window.onload = mostrarMetas;
