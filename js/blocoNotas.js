// MENU HAMBURGUER
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("header nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("active"));

let notaEmEdicao = null;

// GERA UM ID ÚNICO PARA CADA NOTA
function gerarID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// SALVAR NOTA
function salvarNota() {
    const titulo = document.getElementById("notaTitulo").value.trim();
    const conteudo = document.getElementById("notaConteudo").value.trim();
    if (!conteudo) return alert("Digite algum conteúdo!");

    let notas = JSON.parse(localStorage.getItem("notas")) || [];

    if (notaEmEdicao) {
        // Edita nota existente
        const nota = notas.find(n => n.id === notaEmEdicao);
        if (nota) {
            nota.titulo = titulo;
            nota.conteudo = conteudo;
            nota.dataEdicao = new Date().toISOString();
        }
        notaEmEdicao = null;
    } else {
        // Cria nova nota
        notas.push({
            id: gerarID(),
            titulo: titulo,
            conteudo: conteudo,
            dataCriacao: new Date().toISOString(),
            dataEdicao: new Date().toISOString()
        });
    }

    localStorage.setItem("notas", JSON.stringify(notas));
    document.getElementById("notaTitulo").value = "";
    document.getElementById("notaConteudo").value = "";
    mostrarNotas();
}

// FORMATAR NOTA
function formatarNota(texto) {
    return texto
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>')
        .replace(/\n/g, '<br>')
        .replace(/- (.*?)(<br>|$)/g, '<li>$1</li>');
}

// MOSTRAR NOTAS
function mostrarNotas() {
    let notas = JSON.parse(localStorage.getItem("notas")) || [];
    const lista = document.getElementById("listaNotas");
    const ordem = document.getElementById("ordenacaoNotas").value;

    if(ordem === "recentes") {
        notas.sort((a,b) => new Date(b.dataEdicao) - new Date(a.dataEdicao));
    } else {
        notas.sort((a,b) => new Date(a.dataEdicao) - new Date(b.dataEdicao));
    }

    lista.innerHTML = "";
    notas.forEach(n => {
        const tituloHTML = n.titulo ? `<div class="titulo"><b>${n.titulo}</b></div>` : '';
        lista.innerHTML += `<li data-id="${n.id}">
            <div class="conteudo">
                ${tituloHTML}
                <div>${formatarNota(n.conteudo)}</div>
            </div>
            <div class="botoes">
                <button onclick="editarNota('${n.id}')">✏️</button>
                <button onclick="removerNota('${n.id}')">❌</button>
            </div>
        </li>`;
    });
}

// REMOVER NOTA
function removerNota(id) {
    if (!confirm("Tem certeza que deseja remover esta nota?")) return;
    let notas = JSON.parse(localStorage.getItem("notas")) || [];
    notas = notas.filter(n => n.id !== id);
    localStorage.setItem("notas", JSON.stringify(notas));
    mostrarNotas();
}

// EDITAR NOTA
function editarNota(id) {
    let notas = JSON.parse(localStorage.getItem("notas")) || [];
    const nota = notas.find(n => n.id === id);
    if (nota) {
        document.getElementById("notaTitulo").value = nota.titulo;
        document.getElementById("notaConteudo").value = nota.conteudo;
        notaEmEdicao = id;
    }
}

// INICIALIZAÇÃO
window.onload = () => mostrarNotas();
