import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../client.ts";

const app = new Hono();

app.get("/", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token." }, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);

    const response = await supabase
        .from("deck")
        .select();

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

app.get("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token." }, 400);
    }

    const id = ctx.req.param("id");
    const supabase = createSupabaseClient(ctx, accessToken);

    const response = await supabase
        .from("deck")
        .select()
        .eq("id", id)
        .single();

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

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
        .select()
        .single();

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

app.put("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token." }, 400);
    }

    const id = ctx.req.param("id");
    const supabase = createSupabaseClient(ctx, accessToken);

    const updatedDeck = await ctx.req.json();

    const response = await supabase
        .from("deck")
        .update({ name: updatedDeck.name })
        .eq("id", id)
        .select()
        .single();

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

app.delete("/:id", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token." }, 400);
    }

    const id = ctx.req.param("id");
    const supabase = createSupabaseClient(ctx, accessToken);

    const response = await supabase
        .from("deck")
        .delete()
        .eq("id", id);

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json({ message: "Deck was successfully deleted." }, 200);
});

export default app;
