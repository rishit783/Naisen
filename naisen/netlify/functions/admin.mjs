import {
  json, env, isAdmin, validId, loadAll, listKeys, photoIndex, publicConfig,
  responsesStore, photosStore, tokensStore,
} from "../../lib/shared.mjs";

export default async (req) => {
  if (!env("ADMIN_PASSWORD")) {
    return json({ error: "ADMIN_PASSWORD isn't set. Add it under Site configuration > Environment variables in Netlify, then redeploy." }, 500);
  }
  if (!isAdmin(req)) return json({ error: "Wrong password." }, 401);

  const responses = responsesStore();

  if (req.method === "GET") {
    // Clear out expired upload tokens while we're here.
    const tokens = tokensStore();
    for (const key of await listKeys(tokens)) {
      const t = await tokens.get(key, { type: "json" });
      if (!t || Date.now() > t.expires) await tokens.delete(key);
    }
    const [all, photos] = await Promise.all([loadAll(responses), photoIndex()]);
    return json({ config: publicConfig(), responses: all, photos });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "Bad request." }, 400); }
    const { action, id, value } = body || {};
    if (!validId(id)) return json({ error: "Unknown entry." }, 400);

    if (action === "delete") {
      const photos = photosStore();
      for (const key of await listKeys(photos, `${id}/`)) await photos.delete(key);
      await responses.delete(id);
      await tokensStore().delete(id);
      return json({ ok: true });
    }

    const rec = await responses.get(id, { type: "json" });
    if (!rec) return json({ error: "Entry not found." }, 404);
    if (action === "star") rec.starred = !!value;
    else if (action === "hide") rec.hiddenFromWall = !!value;
    else return json({ error: "Unknown action." }, 400);
    await responses.setJSON(id, rec);
    return json({ ok: true, record: rec });
  }

  return json({ error: "Method not allowed." }, 405);
};

export const config = { path: "/api/admin" };
