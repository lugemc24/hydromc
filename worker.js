/** GoldynCloud AI - Cloudflare Worker proxy for Google Gemini.
 * Required secret: GEMINI_API_KEY
 * Optional variables: GEMINI_MODEL, ALLOWED_ORIGIN
 */
const DEFAULT_MODEL = "gemini-3.8-flash";
const SYSTEM_INSTRUCTION = `Eres GoldynCloud AI, el asistente oficial de GoldynCloud. Responde en español salvo que el usuario pida otro idioma. Ayuda especialmente con Minecraft, hosting, VPS, Linux, Debian, Ubuntu, Pterodactyl, Wings, redes, programación y tecnología. Da instrucciones claras, seguras y paso a paso. Cuando proporciones comandos, explica brevemente qué hacen y advierte antes de ejecutar acciones destructivas. No inventes resultados de comandos ni afirmes haber accedido a servidores o archivos. Si falta información importante, pregunta solo lo necesario.`;

function corsHeaders(origin, allowedOrigin) {
  const allow = allowedOrigin || "*";
  return {
    "Access-Control-Allow-Origin": allow === "*" ? "*" : (origin === allow ? allow : "null"),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}
function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...headers } });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN || "*");
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/api/chat") return json({ error: "Ruta no encontrada." }, 404, headers);
    if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) return json({ error: "Origen no autorizado." }, 403, headers);
    if (!env.GEMINI_API_KEY) return json({ error: "Falta configurar el secreto GEMINI_API_KEY en Cloudflare." }, 500, headers);

    let body;
    try { body = await request.json(); } catch { return json({ error: "El cuerpo de la solicitud no es JSON válido." }, 400, headers); }
    if (!Array.isArray(body.messages) || body.messages.length === 0) return json({ error: "No hay mensajes para enviar." }, 400, headers);

    const messages = body.messages.slice(-24).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "").slice(0, 12000) }]
    })).filter(m => m.parts[0].text.trim());
    if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "El último mensaje debe ser del usuario." }, 400, headers);

    const model = String(env.GEMINI_MODEL || DEFAULT_MODEL).replace(/[^a-zA-Z0-9._-]/g, "");
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
    try {
      const upstream = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: messages,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        })
      });
      const result = await upstream.json().catch(() => ({}));
      if (!upstream.ok) {
        const message = result?.error?.message || `Gemini respondió con estado ${upstream.status}.`;
        return json({ error: message }, upstream.status >= 500 ? 502 : 400, headers);
      }
      const reply = (result?.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim();
      if (!reply) return json({ error: "Gemini no devolvió texto. Intenta reformular tu pregunta." }, 502, headers);
      return json({ reply, model }, 200, headers);
    } catch {
      return json({ error: "No se pudo conectar con Gemini. Inténtalo de nuevo." }, 502, headers);
    }
  }
};
