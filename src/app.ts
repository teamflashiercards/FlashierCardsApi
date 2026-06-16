import { Hono } from "hono";
import { cors } from "hono/cors";
import profileRoutes from "./routes/profile.ts";

const app = new Hono();

app.use("*", cors({
    origin: "http://https://flashiercardswebv2.pages.dev",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));

// mount routes
app.route("/api/profile", profileRoutes);

export default app;