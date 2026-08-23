import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../utils/client.ts";

const app = new Hono();

// get /api/deck returns all the decks
app.get("/", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);

    const response = await supabase
    .from("deck")
    .select("id, name");

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

// get /api/deck/id returns a deck based on deck id
app.get("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);
    const deckId = ctx.req.param("id");

    const response = await supabase
    .from("deck")
    .select("id, name")
    .eq("id", deckId);

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

// post /api/deck creates a new deck
app.post("/", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);

    const user = await supabase.auth.getClaims(accessToken);
    if (user.error) return ctx.json(user.error, 400);

    const userId = user.data?.claims.sub;
    const newDeck = await ctx.req.json();

    const response = await supabase
    .from("deck")
    .insert({ user_id: userId, name: newDeck.name })
    .select("id, name");

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

// put /api/deck/id updates a deck based on deck id
app.put("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);

    const deckId = ctx.req.param("id");
    const updatedDeck = await ctx.req.json();

    const response = await supabase
    .from("deck")
    .update({ name: updatedDeck.name })
    .eq("id", deckId)
    .select("id, name");

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

// delete /api/deck/id deletes a deck based on deck id
app.delete("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);
    const deckId = ctx.req.param("id");

    const response = await supabase
    .from("deck")
    .delete()
    .eq("id", deckId)
    .select("id, name");

    if (response.error) return ctx.json(response.error, 400);
    return ctx.json(response.data, 200);
});

export default app;