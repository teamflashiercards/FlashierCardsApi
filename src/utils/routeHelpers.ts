import { insertText, insertGif, insertSticker } from "./clientHelpers.ts";
import { updateText, updateGif, updateSticker } from "./clientHelpers.ts";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Text } from "../types/text.ts";
import type { Gif } from "../types/gif.ts";
import type { Sticker } from "../types/sticker.ts";
import type { Card } from "../types/card.ts";

// function updates text if text already exist or inserts text if text does not exist
export const textHelper = async (supabase: SupabaseClient, textArr: Text[]) => {
    for (const text of textArr) {
        if (text.id) {
            const response = await updateText(supabase, text);
            if (response.error) throw new Error(response.error.message);
        } else {
            const response = await insertText(supabase, text);
            if (response.error) throw new Error(response.error.message);
        }
    }
};

// function updates gif if gif already exist or inserts gif if gif does not exist
export const gifHelper = async (supabase: SupabaseClient, gifArr: Gif[]) => {
    for (const gif of gifArr) {
        if (gif.id) {
            const response = await updateGif(supabase, gif);
            if (response.error) throw new Error(response.error.message);
        } else {
            const response = await insertGif(supabase, gif);
            if (response.error) throw new Error(response.error.message);
        }
    }
};

// function updates sticker if sticker already exist or inserts sticker if sticker does not exist
export const stickerHelper = async (supabase: SupabaseClient, stickerArr: Sticker[]) => {
    for (const sticker of stickerArr) {
        if (sticker.id) {
            const response = await updateSticker(supabase, sticker);
            if (response.error) throw new Error(response.error.message);
        } else {
            const response = await insertSticker(supabase, sticker);
            if (response.error) throw new Error(response.error.message);
        }
    }
};

// function deletes card in specified deck whose id is not in cardArr
export const deleteCard = async (supabase: SupabaseClient, deckId: number, cardSide: string, cardArr: Card[]) => {
    const cardIds: number[] = cardArr.map((card: { id: number | null; }) => card.id).filter((id: number | null) => id != null);
    const response = await supabase
    .from("card")
    .delete()
    .match({ deck_id: deckId, card_side: cardSide })
    .not("id", "in", `(${cardIds.join()})`);
    if (response.error) throw new Error(response.error.message);
};

// function deletes text on specified card whose id is not in textArr
export const deleteText = async (supabase: SupabaseClient, cardId: number, textArr: Text[]) => {
    const textIds: number[] = textArr.map((text: { id: number | null; }) => text.id).filter((id: number | null) => id != null);
    const response = await supabase
    .from("text")
    .delete()
    .eq("card_id", cardId)
    .not("id", "in", `(${textIds.join()})`);
    if (response.error) throw new Error(response.error.message);
};

// function deletes gif on specified card whose id is not in gifArr
export const deleteGif = async (supabase: SupabaseClient, cardId: number, gifArr: Gif[]) => {
    const gifIds: number[] = gifArr.map((gif: { id: number | null; }) => gif.id).filter((id: number | null) => id != null);
    const response = await supabase
    .from("gif")
    .delete()
    .eq("card_id", cardId)
    .not("id", "in", `(${gifIds.join()})`);
    if (response.error) throw new Error(response.error.message);
};

// function deletes sticker on specified card whose id is not in stickerArr
export const deleteSticker = async (supabase: SupabaseClient, cardId: number, stickerArr: Sticker[]) => {
    const stickerIds: number[] = stickerArr.map((sticker: { id: number | null; }) => sticker.id).filter((id: number | null) => id != null);
    const response = await supabase
    .from("sticker")
    .delete()
    .eq("card_id", cardId)
    .not("id", "in", `(${stickerIds.join()})`);
    if (response.error) throw new Error(response.error.message);
};