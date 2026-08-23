import { serve } from "@hono/node-server";
import app from "./app.ts";
import "dotenv/config";

/* 
    Description: This code is used to run the app for local development.
    Last updated: 6/28/2026
*/

serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});