import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../client.ts";

const app = new Hono();

app.get("/", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);
    
    const response = await supabase
    .from("profile")
    .select()
    .single();
    
    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

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
    const newProfile = await ctx.req.json();
    
    const response = await supabase
    .from("profile")
    .insert({ user_id: userId, animation: newProfile.animation })
    .select()
    .single();

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

app.put("/", async (ctx: Context) => {
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
    const updatedProfile = await ctx.req.json();

    const response = await supabase
    .from("profile")
    .update({ animation: updatedProfile.animation })
    .eq("user_id", userId)
    .select()
    .single();

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

export default app;