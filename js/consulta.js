const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("header nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// ======== DESPESAS ========
function mostrarDespesas() {
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
  const nomeFiltro = document.getElementById("filtroNome").value.toLowerCase();
  const catFiltro = document.getElementById("filtroCategoria").value;

  let tabela = document.getElementById("tabelaDespesas");
  tabela.innerHTML = "";

  let totalFiltro = 0;
  let totalAbertas = 0;
  let totalPagas = 0;

  despesas.forEach(d => {
    let inclui = true;
    if (nomeFiltro) inclui = inclui && d.nome.toLowerCase().includes(nomeFiltro);
    if (catFiltro) inclui = inclui && d.categoria === catFiltro;

    if (inclui) {
      let status = d.paga ? "✅ Pago" : "❌ Em aberto";
      tabela.innerHTML += `<tr>
        <td>${d.nome}</td>
        <td>R$ ${d.valor.toFixed(2)}</td>
        <td>${d.categoria || 'Outros'}</td>
        <td>${status}</td>
      </tr>`;
      totalFiltro += d.valor;
    }

    if (d.paga) totalPagas += d.valor;
    else totalAbertas += d.valor;
  });

  document.getElementById("totalDespesasFiltro").innerText = `Total (com filtros): R$ ${totalFiltro.toFixed(2)}`;
  document.getElementById("totalDespesasAbertas").innerText = `Total em aberto: R$ ${totalAbertas.toFixed(2)}`;
  document.getElementById("totalDespesasPagas").innerText = `Total pagas: R$ ${totalPagas.toFixed(2)}`;
}

function carregarCategoriasDespesas() {
  const select = document.getElementById("filtroCategoria");
  const categorias = JSON.parse(localStorage.getItem("categoriasDespesas")) || [
    "Alimentação","Transporte","Compras","Saúde","Pessoal","Assinaturas","Outros"
  ];

  select.innerHTML = '<option value="">Todas as categorias</option>';

  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// ======== LEMBRETES ========
function mostrarLembretes() {
  let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];
  const nomeFiltro = document.getElementById("filtroLembreteNome").value.toLowerCase();
  const catFiltro = document.getElementById("filtroLembreteCategoria").value;
  const tabela = document.getElementById("tabelaLembretes");
  tabela.innerHTML = "";

  lembretes.forEach(l => {
    let inclui = true;
    if (nomeFiltro) inclui = inclui && l.texto.toLowerCase().includes(nomeFiltro);
    if (catFiltro) inclui = inclui && l.categoria === catFiltro;

    if (inclui) {
      tabela.innerHTML += `<tr>
        <td>${l.texto}</td>
        <td>${l.categoria || 'Outros'}</td>
        <td>${l.data ? l.data.split("-").reverse().join("/") : '-'}</td>
      </tr>`;
    }
  });
}

function carregarCategoriasLembretes() {
  const select = document.getElementById("filtroLembreteCategoria");
  const categorias = JSON.parse(localStorage.getItem("categoriasLembretes")) || [
    "Aniversário","Compras","Trabalho","Faculdade","Outros"
  ];

  select.innerHTML = '<option value="">Todas as categorias</option>';
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// ======== RENDAS ========
function mostrarRendas() {
  let rendas = JSON.parse(localStorage.getItem("rendas")) || [];
  const tabela = document.getElementById("tabelaRendas");
  tabela.innerHTML = "";

  let total = 0;
  rendas.forEach(r => {
    tabela.innerHTML += `<tr>
      <td>${r.nome}</td>
      <td>R$ ${r.valor.toFixed(2)}</td>
    </tr>`;
    total += r.valor;
  });

  document.getElementById("totalRendas").innerText = `Total de rendas: R$ ${total.toFixed(2)}`;
}

// ======== INICIALIZAÇÃO ========
window.onload = () => {
  carregarCategoriasDespesas();
  carregarCategoriasLembretes();
  mostrarDespesas();
  mostrarLembretes();
  mostrarRendas();
};
