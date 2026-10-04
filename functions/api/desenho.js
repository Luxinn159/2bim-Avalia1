import {
  gerarDesenho,
  numeroValido
} from "../../lib/desenho.js";

export async function onRequestPost(context) {
  try {
    const authorization = context.request.headers.get("Authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return new Response("Token ausente.", { status: 401 });
    }

    const token = authorization.slice(7);

    const respostaGoogle = await fetch(
      "https://oauth2.googleapis.com/tokeninfo?id_token=" +
        encodeURIComponent(token)
    );

    if (!respostaGoogle.ok) {
      return new Response("Token inválido.", { status: 401 });
    }

    const dadosToken = await respostaGoogle.json();

    if (
      dadosToken.aud !== context.env.GOOGLE_CLIENT_ID ||
      dadosToken.email_verified !== "true" ||
      !dadosToken.email
    ) {
      return new Response("Token não autorizado.", { status: 401 });
    }

    const dados = await context.request.json();
    const numero = Number(dados.numero);

    if (!numeroValido(numero)) {
      return new Response(
        "Digite um inteiro entre 1 e 100.",
        { status: 400 }
      );
    }

    const svg = gerarDesenho(numero, dadosToken.email);

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return new Response("Requisição inválida.", {
      status: 400
    });
  }
}

export function onRequest(context) {
  return new Response("Método não permitido.", {
    status: 405,
    headers: {
      Allow: "POST"
    }
  });
}
