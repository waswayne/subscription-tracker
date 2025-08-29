import aj from "../config/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too Many Requests" });
      }
      if (decision.reason.isBot()) {
        return res.status(403).json({ error: "No bots allowed" });
      }
      return res.status(403).json({ error: "Forbidden" });
    }

    if (decision.ip.isHosting() || decision.results.some(isSpoofedBot)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (error) {
    console.error("Arcjet error:", error);
    next();
  }
};
