import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../utils/client.ts";

const app = new Hono();

// get /api/profile route returns user profile
app.get("/", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);
    
    const response = await supabase
    .from("profile")
    .select();
    
    if (response.error) {
        return ctx.json(response.error, 400);
    } else if (response.data.length === 0) {
        return ctx.json({ message: "User profile does not exist." }, 400);
    }

    return ctx.json(response.data, 200);
});

// post /api/profile route creates user profile
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
    .select();

    if (response.error) {
        return ctx.json(response.error, 400);
    } else if (response.data.length === 0) {
        return ctx.json({ message: "User profile was not created." }, 400);
    }

    return ctx.json(response.data, 200);
});

// put /api/profile route updates user profile based on user id
app.put("/:id", async (ctx: Context) => {
    const profileId = ctx.req.param("id");
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }
    
    const supabase = createSupabaseClient(ctx, accessToken);
    const updatedProfile = await ctx.req.json();

    const response = await supabase
    .from("profile")
    .update({ animation: updatedProfile.animation })
    .eq("id", profileId)
    .select();

    if (response.error) {
        return ctx.json(response.error, 400);
    } else if (response.data.length === 0) {
        return ctx.json({ message: `User profile with id ${profileId} does not exist.` }, 400);
    }

    return ctx.json(response.data, 200);
});

export default app;