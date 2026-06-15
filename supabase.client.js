import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const createSupabaseClient = (accessToken) => {
    const options = {
        global: {
            headers: { Authorization: `Bearer ${accessToken}` }
        }
    };
    return createClient(supabaseUrl, supabaseKey, options);
};