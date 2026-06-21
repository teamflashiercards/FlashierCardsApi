import { createClient } from "@supabase/supabase-js";
import type { Context } from "hono";
import { env } from "hono/adapter";

export const createSupabaseClient = (ctx: Context, accessToken: string) => {
    const { SUPABASE_URL, SUPABASE_KEY } = env<{ SUPABASE_URL: string, SUPABASE_KEY: string }>(ctx);
    return createClient(SUPABASE_URL, SUPABASE_KEY, { 
        global: { 
            headers: { Authorization: `Bearer ${accessToken}` }
        }
    });
};