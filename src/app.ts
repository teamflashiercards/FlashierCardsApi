import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import deckRoutes from "./routes/deck.ts";
import cardRoutes from "./routes/card.ts";
import profileRoutes from "./routes/profile.ts";

const app = new Hono();

// cors middleware
app.use("/api/*", cors({
    origin: (_origin, ctx) => {
        const { WEB_CLIENT } = env<{ WEB_CLIENT: string }>(ctx);
        return WEB_CLIENT;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 600,
    credentials: true
}));

// mount routes
app.route("/api/deck", deckRoutes);
app.route("/api/deck", cardRoutes);
app.route("/api/profile", profileRoutes);

export default app;