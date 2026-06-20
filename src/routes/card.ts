import { Hono } from "hono";
import type { Context } from "hono";
import { createSupabaseClient } from "../client.ts";

const app = new Hono();

//get all cards from deck based on ID
app.get("/:deckId", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }
    const supabase = createSupabaseClient(ctx, accessToken);
    const deckId = ctx.req.param("deckId");

    const response = await supabase
        .from("card")
        .select()
        .eq("deck_id", deckId)
        .order("card_num", { ascending: true });

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

// create a new card for deck
app.post("/:deckId", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }
    const supabase = createSupabaseClient(ctx, accessToken);
    const deckId = ctx.req.param("deckId");
    const newCard = await ctx.req.json();

    const response = await supabase
    .from("card")
    .insert({deck_id: deckId, card_num: newCard.card_num, card_side: newCard.card_side})
    .select()
    .single();
    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

// get specific card based on ID
app.get("/content/:cardId", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }
    const supabase = createSupabaseClient(ctx, accessToken);
    const cardId = ctx.req.param("cardId");

    const texts = await supabase
    .from("text")
    .select()
    .eq("card_id", cardId);

    const gifs = await supabase
    .from("gif")
    .select()
    .eq("card_id", cardId);

    const stickers = await supabase
    .from("sticker")
    .select()
    .eq("card_id", cardId);

    if (texts.error) {
        return ctx.json(texts.error, 400);
    }

    if (gifs.error) {
        return ctx.json(gifs.error, 400);
    }

    if (stickers.error) {
        return ctx.json(stickers.error, 400);
    }

    return ctx.json({texts: texts.data, gifs: gifs.data, stickers: stickers.data}, 200);
});

// create a text input on card
app.post("/:cardId/text", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

  const supabase = createSupabaseClient(ctx, accessToken);
  const cardId = ctx.req.param("cardId");
  const newText = await ctx.req.json();

  const response = await supabase
    .from("text")
    .insert({
        card_id: cardId,
        input: newText.input,
        font_size: newText.font_size,
        color: newText.color,
        x: newText.x,
        y: newText.y,
    })
    .select()
    .single();

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

// create gif for card
app.post("/:cardId/gif", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

  const supabase = createSupabaseClient(ctx, accessToken);
  const cardId = ctx.req.param("cardId");
  const newGif = await ctx.req.json();

  const response = await supabase
    .from("gif")
    .insert({
        card_id: cardId,
        url: newGif.url,
        width: newGif.width,
        height: newGif.height,
        x: newGif.x,
        y: newGif.y
    })
    .select()
    .single();

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

// create sticker for card
app.post("/:cardId/sticker", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

  const supabase = createSupabaseClient(ctx, accessToken);
  const cardId = ctx.req.param("cardId");
  const newSticker = await ctx.req.json();

  const response = await supabase
    .from("sticker")
    .insert({
        card_id: cardId,
        url: newSticker.url,
        width: newSticker.width,
        height: newSticker.height,
        x: newSticker.x,
        y: newSticker.y
    })
    .select()
    .single();

    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

// delete specific card
app.delete("/:cardId", async (ctx: Context) => {
    const accessToken = ctx.req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        return ctx.json({ message: "Please provide a valid token."}, 400);
    }

    const supabase = createSupabaseClient(ctx, accessToken);
    const cardId = ctx.req.param("cardId");

    const response = await supabase
        .from("card")
        .delete()
        .eq("id", cardId);
    
    if (response.error) {
        return ctx.json(response.error, 400);
    }

    return ctx.json(response.data, 200);
});

export default app;