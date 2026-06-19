import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../client.ts";

const app = new Hono();

// get /api/deck returns all decks
app.get("/", async (ctx: Context) => {
    
});

// get /api/deck/id returns deck given id
app.get("/:id", async (ctx: Context) => {

});

// post /api/deck creates a new deck
app.post("/", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);
    const user = await supabase.auth.getClaims(accessToken);

    if (user.error) {
        return ctx.json(user.error, 400);
    }

    const userId = user.data?.claims.user_metadata?.sub;
    const newDeck = await ctx.req.json();

    const response = await supabase
    .from("deck")
    .insert({ user_id: userId, name: newDeck.name })
    .select();

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

// put /api/deck/id updates a deck given id
app.put("/:id", async (ctx: Context) => {
    const deckId = ctx.req.param("id");
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);
    const updatedDeck = await ctx.req.json();

    const response = await supabase
    .from("deck")
    .update({ name: updatedDeck.name })
    .eq("id", deckId)
    .select();

    if (response.error) {
        return ctx.json(response.error, 400);
    } else if (response.data.length === 0) {
        return ctx.json({ message: `Deck with id ${deckId} does not exist.`}, 400);
    }

    return ctx.json(response.data, 200);
});

// delete /api/deck/id deletes a deck given id
app.delete("/:id", async (ctx: Context) => {
    const deckId = ctx.req.param("id");
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);

    const response = await supabase
    .from("deck")
    .delete()
    .eq("id", deckId)
    .select();

    if (response.error) {
        return ctx.json(response.error, 400);
    } else if (response.data.length === 0) {
        return ctx.json({ message: `Deck with id ${deckId} does not exist.`}, 400);
    }

    return ctx.json(response.data, 200);
});

export default app;