import { Hono } from "hono";
import profileRoutes from "./routes/profile.ts";
import cardRoutes from "./routes/card.ts";

const app = new Hono();

// mount routes
app.route("/api/profile", profileRoutes);
app.route("/api/card", cardRoutes);

export default app;