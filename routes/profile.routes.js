import express from "express";
import { createSupabaseClient } from "../supabase.client.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const supabase = createSupabaseClient(accessToken);

        var { data, error } = await supabase
        .from("profile")
        .select();

        if (error) throw error;
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const supabase = createSupabaseClient(accessToken);

        var { data, error } = await supabase.auth.getClaims(accessToken);
        if (error) throw error;

        const userId = data.claims.user_metadata.sub;
        const newProfile = req.body;
        
        var { data, error } = await supabase
        .from("profile")
        .insert({ user_id: userId, animation: newProfile.animation })
        .select();

        if (error) throw error;
        res.status(200).json(email);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/", async (req, res) => {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");
        const supabase = createSupabaseClient(accessToken);

        var { data, error } = await supabase.auth.getClaims(accessToken);
        if (error) throw error;

        const userId = data.claims.user_metadata.sub;
        const updatedProfile = req.body;

        var { data, error } = await supabase
        .from("profile")
        .update({ animation: updatedProfile.animation })
        .eq("user_id", userId)
        .select();
        
        if (error) throw error;
        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;