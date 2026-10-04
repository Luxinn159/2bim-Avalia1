import {
  gerarDesenho,
  numeroValido
} from "../../lib/desenho.js";

export async function onRequest(context) {
  const request = context.request;

  // 1. Método
  if (request.method !== "POST") {
    return new Response("Método não permitido.", {
      status: 405,
      headers: {
        Allow: "POST"
      }
    });
  }

  // 2. Corpo da requisição
  let dados;

  try {
    dados = await request.json();
  } catch {
    return new Response("Requisição inválida.", {
      status: 400
    });
  }

  if (
    !dados ||
    typeof dados.numero !== "number" ||
    !numeroValido(dados.numero)
  ) {
    return new Response(
      "Digite um inteiro entre 1 e 100.",
      { status: 400 }
    );
  }

  const numero = dados.numero;

  // 3. Token Google
  const authorization =
    request.headers.get("Authorization");

  if (
    !authorization ||
    !authorization.startsWith("Bearer ")
  ) {
    return new Response("Token ausente.", {
      status: 401
    });
  }

  const token = authorization.slice(7);

  try {
    const respostaGoogle = await fetch(
      "https://oauth2.googleapis.com/tokeninfo?id_token=" +
        encodeURIComponent(token)
    );

    if (!respostaGoogle.ok) {
      return new Response("Token inválido.", {
        status: 401
      });
    }

    const dadosToken = await respostaGoogle.json();

    if (
      dadosToken.aud !== context.env.GOOGLE_CLIENT_ID ||
      dadosToken.email_verified !== "true" ||
      !dadosToken.email
    ) {
      return new Response("Token não autorizado.", {
        status: 401
      });
    }

    const svg = gerarDesenho(
      numero,
      dadosToken.email
    );

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type":
          "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return new Response("Token inválido.", {
      status: 401
    });
  }
}
