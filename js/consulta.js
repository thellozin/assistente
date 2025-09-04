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
        <td>R$ ${d.valor}</td>
        <td>${d.categoria || 'Outros'}</td>
        <td>${status}</td>
      </tr>`;
      totalFiltro += d.valor;
    }

    if (d.paga) totalPagas += d.valor;
    else totalAbertas += d.valor;
  });

  document.getElementById("totalDespesasFiltro").innerText = `Total (com filtros): R$ ${totalFiltro}`;
  document.getElementById("totalDespesasAbertas").innerText = `Total em aberto: R$ ${totalAbertas}`;
  document.getElementById("totalDespesasPagas").innerText = `Total pagas: R$ ${totalPagas}`;
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
        <td>${l.data || '-'}</td>
      </tr>`;
    }
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
      <td>R$ ${r.valor}</td>
    </tr>`;
    total += r.valor;
  });

  document.getElementById("totalRendas").innerText = `Total de rendas: R$ ${total}`;
}

// ======== INICIALIZAÇÃO ========
window.onload = () => {
  mostrarDespesas();
  mostrarLembretes();
  mostrarRendas();
};
