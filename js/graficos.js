// ===== MENU HAMBURGUER =====
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("header nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("active"));

// ===== PEGAR DADOS =====
const rendas = JSON.parse(localStorage.getItem("rendas") || "[]");
const despesas = JSON.parse(localStorage.getItem("despesas") || "[]");

// ===== RESUMO GERAL =====
const totalRendas = rendas.reduce((acc, r) => acc + r.valor, 0);
const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
const saldo = totalRendas - totalDespesas;

document.getElementById("resumoGeral").innerHTML = `
  <b>Total de Rendas:</b> R$ ${totalRendas.toFixed(2)} | 
  <b>Total de Despesas:</b> R$ ${totalDespesas.toFixed(2)} | 
  <b>Saldo:</b> <span style="color:${saldo >= 0 ? 'green' : 'red'}">R$ ${saldo.toFixed(2)}</span>
`;

// ===== GRAFICO RENDAS X DESPESAS =====
new Chart(document.getElementById("graficoRendaDespesa").getContext("2d"), {
    type: 'bar',
    data: {
        labels: ['Rendas', 'Despesas', 'Saldo'],
        datasets: [{
            label: 'Valores',
            data: [totalRendas, totalDespesas, saldo],
            backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: { callbacks: { label: ctx => `R$ ${ctx.raw.toFixed(2)}` } },
            legend: { display: false }
        },
        scales: { y: { beginAtZero: true } }
    }
});

// ===== GRAFICO GASTOS POR MES =====
const meses = {};
despesas.forEach(d => {
    if (!d.data) return; // ignorar sem data
    const [ano, mes, dia] = d.data.split('-'); // agora compatível com YYYY-MM-DD
    const chave = `${mes}/${ano}`; // chave para gráfico por mês
    meses[chave] = (meses[chave] || 0) + d.valor;
});

new Chart(document.getElementById("graficoMeses").getContext("2d"), {
    type: 'bar',
    data: {
        labels: Object.keys(meses),
        datasets: [{
            label: 'Gastos por Mês',
            data: Object.values(meses),
            backgroundColor: '#36A2EB'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: { callbacks: { label: ctx => `R$ ${ctx.raw.toFixed(2)}` } },
            legend: { display: false }
        },
        scales: { y: { beginAtZero: true } }
    }
});

// ===== GRAFICO DE CATEGORIAS =====
const categorias = {};
despesas.forEach(d => {
    if (!d.categoria) return;
    categorias[d.categoria] = (categorias[d.categoria] || 0) + d.valor;
});

const coresCategorias = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

new Chart(document.getElementById("graficoCategorias").getContext("2d"), {
    type: 'doughnut',
    data: {
        labels: Object.keys(categorias),
        datasets: [{
            data: Object.values(categorias),
            backgroundColor: coresCategorias
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: ctx => `${ctx.label}: R$ ${ctx.raw.toFixed(2)}` } },
            title: { display: true, text: 'Gastos por Categoria', font: { size: 18 } }
        }
    }
});
