import crypto from "node:crypto";
import {
  json, hash, safeEqual, validId, listKeys, ALLOWED_TYPES, MAX_PHOTO_BYTES,
  photosStore, tokensStore,
} from "../../lib/shared.mjs";

const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const token = url.searchParams.get("token") || "";
  const done = url.searchParams.get("done") === "1";
  if (!validId(id) || !token) return json({ error: "Missing upload details." }, 400);

  const tokens = tokensStore();
  const entry = await tokens.get(id, { type: "json" });
  if (!entry || !safeEqual(hash(token), entry.hash)) {
    return json({ error: "This upload link isn't valid. Your written answers were saved." }, 403);
  }
  if (Date.now() > entry.expires) {
    await tokens.delete(id);
    return json({ error: "The upload window has expired. Your written answers were saved." }, 403);
  }
  if (done) {
    await tokens.delete(id);
    return json({ ok: true });
  }

  const type = (req.headers.get("content-type") || "").split(";")[0].trim();
  if (!ALLOWED_TYPES.includes(type)) return json({ error: "Only JPEG, PNG or WebP images can be uploaded." }, 415);

  const data = await req.arrayBuffer();
  if (data.byteLength === 0) return json({ error: "The photo was empty." }, 400);
  if (data.byteLength > MAX_PHOTO_BYTES) return json({ error: "That photo is larger than 5 MB after compression." }, 413);

  const photos = photosStore();
  const existing = await listKeys(photos, `${id}/`);
  if (existing.length >= entry.allowed) return json({ error: "Photo limit reached for this entry." }, 409);

  const key = `${id}/${String(existing.length + 1).padStart(2, "0")}-${crypto.randomBytes(4).toString("hex")}.${EXT[type]}`;
  await photos.set(key, data, { metadata: { contentType: type } });

  if (existing.length + 1 >= entry.allowed) await tokens.delete(id);
  return json({ ok: true, key });
};

export const config = { path: "/api/upload" };
