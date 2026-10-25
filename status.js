import { Redis } from "@upstash/redis";
import { services } from "./_services.js";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const serviceData = await Promise.all(services.map(async (service) => {
      const raw = await redis.lrange(`goldyn:history:${service.id}`, 0, 1439);
      const history = raw.map(item => typeof item === "string" ? JSON.parse(item) : item);
      const last = history[0] || await redis.get(`goldyn:last:${service.id}`) || null;
      const valid = history.filter(item => item && (item.status === "online" || item.status === "offline"));
      const uptime = valid.length
        ? Math.round((valid.filter(item => item.status === "online").length / valid.length) * 10000) / 100
        : null;

      return {
        id: service.id,
        name: service.name,
        url: service.url,
        group: service.group,
        status: last?.status || "unknown",
        latency: last?.latency ?? null,
        httpStatus: last?.httpStatus ?? null,
        checkedAt: last?.timestamp ?? null,
        uptime,
        checks: valid.length,
        history: history.slice(0, 60).reverse().map(item => ({
          timestamp: item.timestamp,
          status: item.status,
          latency: item.latency
        }))
      };
    }));

    const incidentsRaw = await redis.lrange("goldyn:incidents", 0, 49);
    const incidents = incidentsRaw.map(item => typeof item === "string" ? JSON.parse(item) : item);

    const statuses = serviceData.map(s => s.status);
    let overall = "operational";
    if (statuses.some(s => s === "offline")) overall = "outage";
    else if (statuses.some(s => s === "unknown")) overall = "checking";

    return res.status(200).json({
      overall,
      checkedAt: Date.now(),
      services: serviceData,
      incidents
    });
  } catch {
    return res.status(503).json({
      error: "Status data unavailable",
      message: "Comprueba las variables de entorno UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN."
    });
  }
}
