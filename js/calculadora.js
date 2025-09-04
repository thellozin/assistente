let display = document.getElementById('display');
let operacaoAtual = '';

function adicionarNumero(numero) {
  if (operacaoAtual === "0" && numero === "0") return;
  operacaoAtual += numero;
  display.value = operacaoAtual;
}

function adicionarOperacao(operador) {
  if (operador === '+/-') {
    if (operacaoAtual.startsWith('-')) {
      operacaoAtual = operacaoAtual.slice(1);
    } else {
      operacaoAtual = '-' + operacaoAtual;
    }
    display.value = operacaoAtual;
    return;
  }
  
  if (operador === '%') {
    operacaoAtual = (parseFloat(operacaoAtual)/100).toString();
    display.value = operacaoAtual;
    return;
  }

  if (operacaoAtual === '') return;
  operacaoAtual += operador;
  display.value = operacaoAtual;
}

function calcular() {
  try {
    operacaoAtual = eval(operacaoAtual.replace('×', '*').replace('÷', '/')).toString();
    display.value = operacaoAtual;
  } catch (e) {
    display.value = 'Erro';
    operacaoAtual = '';
  }
}

function limpar() {
  operacaoAtual = '';
  display.value = '';
}
