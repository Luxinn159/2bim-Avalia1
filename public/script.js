// script.js
// O navegador envia o número para a Pages Function.
// O SVG é gerado no servidor.

const formulario = document.getElementById("formulario");
const campoNumero = document.getElementById("numero");

const area = document.getElementById("desenho");
const mensagem = document.getElementById("mensagem");
const botaoBaixar = document.getElementById("baixar");
const botaoGoogle = document.getElementById("entrar-google");

let svgAtual = "";

botaoGoogle.addEventListener("click", () => {
  const retorno = window.location.origin;

  window.location.href =
    "https://oauth-pages-lab.pages.dev/oauth/login/google?returnTo=" +
    encodeURIComponent(retorno);
});

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagem.textContent = "";

  const numero = Number(campoNumero.value);

  if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
    mensagem.textContent = "Digite um inteiro entre 1 e 100.";
    return;
  }

  try {
    const resposta = await fetch("/api/desenho", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        numero,
        email: "usuario@exemplo.com"
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
