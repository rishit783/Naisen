import { cfg, json, isAdmin, validId, photosStore, responsesStore } from "../../lib/shared.mjs";

export default async (req) => {
  const key = new URL(req.url).searchParams.get("key") || "";
  const id = key.split("/")[0];
  if (!validId(id) || !/^[0-9a-f-]{36}\/[\w.-]+$/.test(key)) return json({ error: "Invalid photo." }, 400);

  const admin = isAdmin(req);
  if (!admin) {
    const rec = await responsesStore().get(id, { type: "json" });
    const isPublic = cfg.wallEnabled && rec && rec.showOnWall && !rec.hiddenFromWall;
    if (!isPublic) return json({ error: "This photo is private." }, 403);
  }

  const result = await photosStore().getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) return json({ error: "Photo not found." }, 404);

  return new Response(result.data, {
    headers: {
      "content-type": result.metadata?.contentType || "image/jpeg",
      "cache-control": admin ? "private, max-age=3600" : "public, max-age=300",
    },
  });
};

export const config = { path: "/api/photo" };
