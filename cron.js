import { Redis } from "@upstash/redis";
import { services } from "./_services.js";

const redis = Redis.fromEnv();

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const results = await Promise.all(services.map(async (service) => {
    const start = Date.now();
    let status = "offline";
    let latency = null;
    let httpStatus = null;
    let error = null;

    try {
      const response = await fetch(service.url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
        headers: { "User-Agent": "GoldynCloud-Status/1.0" }
      });
      latency = Date.now() - start;
      httpStatus = response.status;
      status = response.ok ? "online" : "offline";
      await response.body?.cancel();
    } catch (e) {
      latency = Date.now() - start;
      error = (e?.name === "TimeoutError" || e?.name === "AbortError")
        ? "timeout" : "connection_error";
    }

    const record = { timestamp: Date.now(), status, latency, httpStatus, error };
    const key = `goldyn:history:${service.id}`;
    await redis.lpush(key, JSON.stringify(record));
    await redis.ltrim(key, 0, 1439);

    const previous = await redis.get(`goldyn:last:${service.id}`);
    if (previous && previous.status !== status) {
      await redis.lpush("goldyn:incidents", JSON.stringify({
        id: `${service.id}-${record.timestamp}`,
        serviceId: service.id,
        serviceName: service.name,
        timestamp: record.timestamp,
        status,
        message: status === "online" ? "Servicio recuperado" : "Servicio no disponible"
      }));
      await redis.ltrim("goldyn:incidents", 0, 199);
    } else if (!previous && status === "offline") {
      await redis.lpush("goldyn:incidents", JSON.stringify({
        id: `${service.id}-${record.timestamp}`,
        serviceId: service.id,
        serviceName: service.name,
        timestamp: record.timestamp,
        status,
        message: "Servicio no disponible en la primera comprobación"
      }));
      await redis.ltrim("goldyn:incidents", 0, 199);
    }

    await redis.set(`goldyn:last:${service.id}`, record);
    return { id: service.id, status, latency, httpStatus, checkedAt: record.timestamp };
  }));

  return res.status(200).json({ success: true, checkedAt: Date.now(), results });
}
