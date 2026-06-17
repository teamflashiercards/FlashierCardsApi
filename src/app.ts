import { Hono } from "hono";
import deckRoutes from "./routes/deck.ts";
import cardRoutes from "./routes/card.ts";
import { cors } from "hono/cors";
import profileRoutes from "./routes/profile.ts";

const app = new Hono();

app.use("*", cors({
    origin: "https://flashiercardswebv2.pages.dev",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    maxAge: 600
}));

// mount routes
app.route("/api/deck", deckRoutes);
app.route("/api/card", cardRoutes);
app.route("/api/profile", profileRoutes);

export default app;