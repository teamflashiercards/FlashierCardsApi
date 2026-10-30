import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../utils/client.ts";

/* 
    Description: This file contains routes that fetch, create, update, and delete deck and deck content.
    Last updated: 10/30/2026
*/

const app = new Hono();

// get /api/decks returns all the decks
app.get("/", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);

    const response = await supabase
    .from("decks")
    .select("id, name");

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

// get /api/deck/id returns deck content based on deck id
app.get("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);
    const deckId = ctx.req.param("id");

    const response = await supabase
    .from("decks")
    .select("id, name, content")
    .eq("id", deckId);

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

// post /api/deck creates a new deck with initial deck content
app.post("/", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);

    const user = await supabase.auth.getClaims(accessToken);
    if (user.error) return ctx.json(user.error, 400);

    const userId = user.data?.claims.sub;
    const newDeck = await ctx.req.json();

    const response = await supabase
    .from("decks")
    .insert({ user_id: userId, name: newDeck.name, content: newDeck.content })
    .select("id, name, content");

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

// put /api/deck/id/name updates deck name based on deck id
app.put("/:id/name", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);

    const deckId = ctx.req.param("id");
    const updatedDeck = await ctx.req.json();

    const response = await supabase
    .from("decks")
    .update({ name: updatedDeck.name })
    .eq("id", deckId)
    .select("id, name");

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

// put /api/deck/id/content updates deck content based on deck id
app.put("/:id/content", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);

    const deckId = ctx.req.param("id");
    const updatedDeck = await ctx.req.json();

    const response = await supabase
    .from("decks")
    .update({ content: updatedDeck.content })
    .eq("id", deckId)
    .select("id, name, content");

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

// delete /api/deck/id deletes deck based on deck id
app.delete("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);
    const deckId = ctx.req.param("id");

    const response = await supabase
    .from("decks")
    .delete()
    .eq("id", deckId)
    .select("id, name, content");

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

export default app;