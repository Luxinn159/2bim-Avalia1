// script.js
// Versao inicial: todo o trabalho acontece no navegador.
// A tarefa consiste em levar gerarDesenho para o servidor (Pages Functions)
// e fazer esta pagina apenas enviar o numero e exibir a resposta.

import { gerarDesenho, numeroValido } from "./lib/desenho.js";

const formulario = document.getElementById("formulario");
const campoNumero = document.getElementById("numero");

const area = document.getElementById("desenho");
const mensagem = document.getElementById("mensagem");
const botaoBaixar = document.getElementById("baixar");
const botaoGoogle = document.getElementById("entrar-google");

botaoGoogle.addEventListener("click", () => {
  const retorno = window.location.origin;

  window.location.href =
    "https://oauth-pages-lab.pages.dev/oauth/login/google?returnTo=" +
    encodeURIComponent(retorno);
});
let svgAtual = "";

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  mensagem.textContent = "";

  const numero = Number(campoNumero.value);
 

  if (!numeroValido(numero)) {
    mensagem.textContent = "Digite um inteiro entre 1 e 100.";
    return;
  }
 
  

  svgAtual = gerarDesenho(numero);
  area.innerHTML = svgAtual;
  botaoBaixar.hidden = false;
});

botaoBaixar.addEventListener("click", () => {
  const arquivo = new Blob([svgAtual], { type: "image/svg+xml" });
  const url = URL.createObjectURL(arquivo);
  const link = document.createElement("a");
  link.href = url;
  link.download = "exemplo.svg";
  link.click();
  URL.revokeObjectURL(url);
});
