import { Hono } from "hono";
import profileRoutes from "./routes/profile.ts";

const app = new Hono();

// mount routes
app.route("/api/profile", profileRoutes);

export default app;