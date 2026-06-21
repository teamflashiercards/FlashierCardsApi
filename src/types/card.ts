import type { Gif } from "./gif.ts";
import type { Sticker } from "./sticker.ts";

export type Card = {
    id: number,
    deck_id: number,
    card_num: number,
    card_side: string,
    text: Text[],
    gif: Gif[],
    sticker: Sticker[]
};