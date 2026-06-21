import { insertText, insertGif, insertSticker } from "./clientHelpers.ts";
import { updateText, updateGif, updateSticker } from "./clientHelpers.ts";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Text } from "../types/text.ts";
import type { Gif } from "../types/gif.ts";
import type { Sticker } from "../types/sticker.ts";

export const textHelper = async (supabase: SupabaseClient, textArr: Text[]) => {
    for (const text of textArr) {
        // update text if text already exist
        if (text.id) {
            const response = await updateText(supabase, text);
            if (response.error) throw new Error(response.error.message);

        // create text if text does not exist
        } else {
            const response = await insertText(supabase, text);
            if (response.error) throw new Error(response.error.message);
        }
    }
};

export const gifHelper = async (supabase: SupabaseClient, gifArr: Gif[]) => {
    for (const gif of gifArr) {
        // update gif if gif already exist
        if (gif.id) {
            const response = await updateGif(supabase, gif);
            if (response.error) throw new Error(response.error.message);
            
        // create gif if gif does not exist
        } else {
            const response = await insertGif(supabase, gif);
            if (response.error) throw new Error(response.error.message);
        }
    }
};

export const stickerHelper = async (supabase: SupabaseClient, stickerArr: Sticker[]) => {
    for (const sticker of stickerArr) {
        // update sticker if sticker already exist
        if (sticker.id) {
            const response = await updateSticker(supabase, sticker);
            if (response.error) throw new Error(response.error.message);
            
        // create sticker if sticker does not exist
        } else {
            const response = await insertSticker(supabase, sticker);
            if (response.error) throw new Error(response.error.message);
        }
    }
};