import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../utils/client.ts";
import { insertCard } from "../utils/clientHelpers.ts";
import { deleteCardsHelper, saveDeckHelper } from "../utils/routeHelpers.ts";

const app = new Hono();

// get /api/deck/id/content returns deck content based on deck id
app.get("/:id/content", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);
    const deckId = ctx.req.param("id");

    // get front of deck content
    const frontCards = await supabase
    .from("card")
    .select("*, text(*), gif(*), sticker(*)")
    .match({ deck_id: deckId, card_side: "front" })
    .order("card_num", { ascending: true });
    
    if (frontCards.error) return ctx.json(frontCards.error, 400);

    // get back of deck content
    const backCards = await supabase
    .from("card")
    .select("*, text(*), gif(*), sticker(*)")
    .match({ deck_id: deckId, card_side: "back" })
    .order("card_num", { ascending: true });
    
    if (backCards.error) return ctx.json(backCards.error, 400);
    return ctx.json({ front_cards: frontCards.data, back_cards: backCards.data }, 200);
});

// post /api/deck/id/create creates initial deck content when a new deck is created
app.post("/:id/create", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);

    const deckId = ctx.req.param("id");
    const newDeckContent = await ctx.req.json();

    // create front of card
    const response = await insertCard(supabase, newDeckContent.front_card);
    if (response.error) return ctx.json(response.error, 400);

    // create back of card
    const newResponse = await insertCard(supabase, newDeckContent.back_card);
    if (newResponse.error) return ctx.json(newResponse.error, 400);

    return ctx.json({ message: `Content for deck with id ${deckId} was successfully created.` }, 200);
});

// post /api/deck/id/save creates, updates, or deletes deck content when a deck is saved
app.post("/:id/save", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) return ctx.json({ message: "Please provide a valid token." }, 400);

    const supabase = createSupabaseClient(ctx, accessToken);

    const deckId = ctx.req.param("id");
    const updatedDeckContent = await ctx.req.json();
    
    try {
        // delete cards removed from the request but exist in db
        await deleteCardsHelper(supabase, Number(deckId), "front", updatedDeckContent.front_cards);
        await deleteCardsHelper(supabase, Number(deckId), "back", updatedDeckContent.back_cards);

        // save content on front and back side of cards
        await saveDeckHelper(supabase, updatedDeckContent.front_cards);
        await saveDeckHelper(supabase, updatedDeckContent.back_cards);

    } catch (error: any) {
        return ctx.json(error, 400);
    }

    return ctx.json({ message: `Content for deck with id ${deckId} was successfully saved.` }, 200);
});

export default app;