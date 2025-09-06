// ----- MENU HAMBURGUER -----
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("header nav");
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// ----- NOTAS -----
window.onload = () => {
  mostrarNotas();
};

function adicionarNota() {
  const titulo = document.getElementById("tituloNota").value.trim();
  if (!titulo) return alert("Digite um título para a nota!");

  const notas = JSON.parse(localStorage.getItem("notas")) || [];
  notas.push({ titulo, conteudo: "" });
  localStorage.setItem("notas", JSON.stringify(notas));

  document.getElementById("tituloNota").value = "";
  mostrarNotas();
}

function mostrarNotas() {
  const notas = JSON.parse(localStorage.getItem("notas")) || [];
  const container = document.getElementById("notas");
  container.innerHTML = "";

  notas.forEach((nota, i) => {
    const div = document.createElement("div");
    div.className = "nota";

    const titulo = document.createElement("strong");
    titulo.innerText = nota.titulo;

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Escreva sua nota aqui...";
    textarea.value = nota.conteudo;
    textarea.addEventListener("input", () => salvarConteudo(i, textarea.value));

    const botaoExcluir = document.createElement("button");
    botaoExcluir.innerText = "🗑️ Excluir";
    botaoExcluir.onclick = () => removerNota(i);

    div.appendChild(titulo);
    div.appendChild(textarea);
    div.appendChild(botaoExcluir);
    container.appendChild(div);
  });
}

function salvarConteudo(i, texto) {
  const notas = JSON.parse(localStorage.getItem("notas")) || [];
  notas[i].conteudo = texto;
  localStorage.setItem("notas", JSON.stringify(notas));
}

function removerNota(i) {
  if (!confirm("Tem certeza que deseja excluir esta nota?")) return;
  const notas = JSON.parse(localStorage.getItem("notas")) || [];
  notas.splice(i, 1);
  localStorage.setItem("notas", JSON.stringify(notas));
  mostrarNotas();
}
