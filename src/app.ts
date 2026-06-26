import { Hono } from "hono";
import profileRoutes from "./routes/profile.ts";
import cardRoutes from "./routes/card.ts";
import deckRoutes from "./routes/deck.ts";

const app = new Hono();

// mount routes
app.route("/api/profile", profileRoutes);
app.route("/api/card", cardRoutes);
app.route("/api/deck", deckRoutes);

export default app;