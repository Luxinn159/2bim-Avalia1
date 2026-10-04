// script.js
// O navegador recebe o ID token do Google e o envia
// para a Pages Function no cabeçalho Authorization.

const formulario = document.getElementById("formulario");
const campoNumero = document.getElementById("numero");
const area = document.getElementById("desenho");
const mensagem = document.getElementById("mensagem");
const botaoBaixar = document.getElementById("baixar");
const usuario = document.getElementById("usuario");

let idToken = null;
let svgAtual = "";

// Chamada pelo Google Identity Services depois do login.
window.receberLoginGoogle = function (response) {
  idToken = response.credential;

  usuario.textContent = "Login com Google realizado.";
  mensagem.textContent = "";
};

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagem.textContent = "";

  if (!idToken) {
    mensagem.textContent = "Entre com Google antes de desenhar.";
    return;
  }

  const numero = Number(campoNumero.value);

  if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
    mensagem.textContent = "Digite um inteiro entre 1 e 100.";
    return;
  }

  try {
    const resposta = await fetch("/api/desenho", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },

      body: JSON.stringify({
        numero
      })
    });

    if (!resposta.ok) {
      mensagem.textContent = await resposta.text();
      return;
    }

    svgAtual = await resposta.text();

    area.innerHTML = svgAtual;
    botaoBaixar.hidden = false;
  } catch {
    mensagem.textContent =
      "Não foi possível gerar o desenho.";
  }
});

botaoBaixar.addEventListener("click", () => {
  const arquivo = new Blob(
    [svgAtual],
    { type: "image/svg+xml" }
  );

  const url = URL.createObjectURL(arquivo);
  const link = document.createElement("a");

  link.href = url;
  link.download = "exemplo.svg";
  link.click();

  URL.revokeObjectURL(url);
});
