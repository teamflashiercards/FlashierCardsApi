import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../utils/client.ts";

const app = new Hono();
//GET decks
app.get("/", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token." }, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);

    const response = await supabase
    .from("deck")
    .select("id, name");

    return ctx.json(response.data, 200);
});
//get a specfic deck
app.get("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token." }, 400);
    }

    const deckId = ctx.req.param("id");
    const supabase = createSupabaseClient(ctx, accessToken);

    const response = await supabase
    .from("deck")
    .select("id, name")
    .eq("id", deckId);

    return ctx.json(response.data, 200);
});
//create a new deck
app.post("/", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token." }, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);

    const user = await supabase.auth.getUser(accessToken);
    if (user.error) {
        return ctx.json(user.error, 400);
    }

    const userId = user.data.user.id;
    const newDeck = await ctx.req.json();

    const response = await supabase
    .from("deck")
    .insert({ user_id: userId, name: newDeck.name })
    .select("id, name");

    return ctx.json(response.data, 200);
});
//rename a deck
app.put("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token." }, 400);
    }

    const deckId = ctx.req.param("id");
    const supabase = createSupabaseClient(ctx, accessToken);

    const updatedDeck = await ctx.req.json();

    const response = await supabase
    .from("deck")
    .update({ name: updatedDeck.name })
    .eq("id", deckId)
    .select("id, name");

    return ctx.json(response.data, 200);
});
//delete a deck
app.delete("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token." }, 400);
    }

    const deckId = ctx.req.param("id");
    const supabase = createSupabaseClient(ctx, accessToken);

    const response = await supabase
    .from("deck")
    .delete()
    .eq("id", deckId)
    .select("id, name");

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json({ message: "Deck was successfully deleted." }, 200);
});

export default app;
