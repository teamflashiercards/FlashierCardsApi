import type { SupabaseClient } from "@supabase/supabase-js";
import type { Card } from "../types/card.ts";
import type { Text } from "../types/text.ts";
import type { Gif } from "../types/gif.ts";
import type { Sticker } from "../types/sticker.ts";

export const insertCard = async (supabase: SupabaseClient, card: Card) => {
    const response = await supabase
    .from("card")
    .insert({ 
        deck_id: card.deck_id, 
        card_num: card.card_num, 
        card_side: card.card_side 
    })
    .select();
    return response;
};

export const updateCard = async (supabase: SupabaseClient, card: Card) => {
    const response = await supabase
    .from("card")
    .update({ 
        card_num: card.card_num
    })
    .eq("id", card.id)
    .select();
    return response;
};

export const deleteCard = async (supabase: SupabaseClient, card: Card) => {
    const response = await supabase
    .from("card")
    .delete()
    .eq("id", card.id)
    .select();
    return response;
};

export const insertText = async (supabase: SupabaseClient, text: Text) => {
    const response = await supabase
    .from("text")
    .insert({
        card_id: text.card_id, 
        input: text.input, 
        font_size: text.font_size, 
        color: text.color, 
        x: text.x, 
        y: text.y 
    })
    .select();
    return response;
};

export const updateText = async (supabase: SupabaseClient, text: Text) => {
    const response = await supabase
    .from("text")
    .update({ 
        input: text.input, 
        font_size: text.font_size, 
        color: text.color, 
        x: text.x, 
        y: text.y 
    })
    .eq("id", text.id)
    .select();
    return response;
};

export const insertGif = async (supabase: SupabaseClient, gif: Gif) => {
    const response = await supabase
    .from("gif")
    .insert({
        card_id: gif.card_id,
        url: gif.url,
        width: gif.width,
        height: gif.height,
        x: gif.x,
        y: gif.y
    })
    .select();
    return response;
};

export const updateGif = async (supabase: SupabaseClient, gif: Gif) => {
    const response = await supabase
    .from("gif")
    .update({
        url: gif.url,
        width: gif.width,
        height: gif.height,
        x: gif.x,
        y: gif.y
    })
    .eq("id", gif.id)
    .select();
    return response;
};

export const insertSticker = async (supabase: SupabaseClient, sticker: Sticker) => {
    const response = await supabase
    .from("sticker")
    .insert({
        card_id: sticker.card_id,
        url: sticker.url,
        width: sticker.width,
        height: sticker.height,
        x: sticker.x,
        y: sticker.y
    })
    .select();
    return response;
};

export const updateSticker = async (supabase: SupabaseClient, sticker: Sticker) => {
    const response = await supabase
    .from("sticker")
    .update({
        url: sticker.url,
        width: sticker.width,
        height: sticker.height,
        x: sticker.x,
        y: sticker.y
    })
    .eq("id", sticker.id)
    .select();
    return response;
};