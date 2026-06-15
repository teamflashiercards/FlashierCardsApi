import { Hono } from "hono";
import deckRoutes from "./routes/deck.ts";
import cardRoutes from "./routes/card.ts";
import profileRoutes from "./routes/profile.ts";

const app = new Hono();

// mount routes
app.route("/api/deck", deckRoutes);
app.route("/api/card", cardRoutes);
app.route("/api/profile", profileRoutes);

export default app;