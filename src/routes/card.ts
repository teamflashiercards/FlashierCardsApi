import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../utils/client.ts";
import { insertCard, updateCard, deleteCard } from "../utils/clientHelpers.ts";
import { textHelper, gifHelper, stickerHelper } from "../utils/routeHelpers.ts";

const app = new Hono();

// get /api/deck/id/content returns deck content based on deck id
app.get("/:id/content", async (ctx: Context) => {
    const deckId = ctx.req.param("id");
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);

    // get front of deck content
    const frontCards = await supabase
    .from("card")
    .select("id, card_num, text(id, input, font_size, color, x, y), gif(id, url, width, height, x, y), sticker(id, url, width, height, x, y)")
    .match({ deck_id: deckId, card_side: "front" })
    .order("card_num", { ascending: true });
    
    if (frontCards.error) {
        return ctx.json(frontCards.error, 400);
    }

    // get back of deck content
    const backCards = await supabase
    .from("card")
    .select("id, card_num, text(id, input, font_size, color, x, y), gif(id, url, width, height, x, y), sticker(id, url, width, height, x, y)")
    .match({ deck_id: deckId, card_side: "back" })
    .order("card_num", { ascending: true });
    
    if (backCards.error) {
        return ctx.json(backCards.error, 400);
    }

    return ctx.json({ front_cards: frontCards.data, back_cards: backCards.data }, 200);
});

// post /api/deck/id/create creates deck content when a new deck is created
app.post("/:id/create", async (ctx: Context) => {
    const deckId = ctx.req.param("id");
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);
    const newDeckContent = await ctx.req.json();

    const response = await insertCard(supabase, newDeckContent.front_card);
    if (response.error) return ctx.json(response.error, 400);


    const newResponse = await insertCard(supabase, newDeckContent.back_card);
    if (newResponse.error) return ctx.json(newResponse.error, 400);

    return ctx.json({ message: `Content for deck with id ${deckId} was successfully created.` }, 200);
});

// post /api/deck/id/save creates, updates, or deletes deck content when a deck is saved
app.post("/:id/save", async (ctx: Context) => {
    const deckId = ctx.req.param("id");
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);
    const updatedDeckContent = await ctx.req.json();

    for (const frontCard of updatedDeckContent.front_cards) {
        // update front side of card if it already exist
        if (frontCard.id) {
            const response = await updateCard(supabase, frontCard);
            if (response.error) return ctx.json(response.error, 400);

            try {
                textHelper(supabase, frontCard.text);
                gifHelper(supabase, frontCard.gif);
                stickerHelper(supabase, frontCard.sticker);
            } catch (error: any) {
                return ctx.json(error.message, 400);
            }

        // create front side of card if it does not exist
        } else {
            const response = await insertCard(supabase, frontCard);
            if (response.error) return ctx.json(response.error, 400);

            try {
                textHelper(supabase, frontCard.text);
                gifHelper(supabase, frontCard.gif);
                stickerHelper(supabase, frontCard.sticker);
            } catch (error: any) {
                return ctx.json(error.message, 400);
            }
        }
    }

    for (const backCard of updatedDeckContent.back_cards) {
        // update back side of card if it already exist
        if (backCard.id) {
            const response = await updateCard(supabase, backCard);
            if (response.error) return ctx.json(response.error, 400);

            try {
                textHelper(supabase, backCard.text);
                gifHelper(supabase, backCard.gif);
                stickerHelper(supabase, backCard.sticker);
            } catch (error: any) {
                return ctx.json(error.message, 400);
            }

        // create back side of card if it does not exist
        } else {
            const response = await insertCard(supabase, backCard);
            if (response.error) return ctx.json(response.error, 400);

            try {
                textHelper(supabase, backCard.text);
                gifHelper(supabase, backCard.gif);
                stickerHelper(supabase, backCard.sticker);
            } catch (error: any) {
                return ctx.json(error.message, 400);
            }
        }
    }

    return ctx.json({ message: `Content for deck with id ${deckId} was successfully saved.` }, 200);
});

export default app;