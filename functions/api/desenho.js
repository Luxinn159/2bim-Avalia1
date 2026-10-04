import {
  gerarDesenho,
  numeroValido
} from "../../public/lib/desenho.js";

export async function onRequestPost(context) {
  try {
    const dados = await context.request.json();
    const numero = Number(dados.numero);
    const email = dados.email;

    if (!numeroValido(numero)) {
      return new Response(
        "Digite um inteiro entre 1 e 100.",
        { status: 400 }
      );
    }

    if (!email) {
      return new Response(
        "E-mail não informado.",
        { status: 400 }
      );
    }

    const svg = gerarDesenho(numero, email);

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return new Response(
      "Requisição inválida.",
      { status: 400 }
    );
  }
}
