import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../client.ts";

const app = new Hono();

app.get("/", async (ctx: Context) => {
    
});

app.post("/", async (ctx: Context) => {

});

app.put("/", async (ctx: Context) => {
   
});

export default app;