import crypto from "node:crypto";
import {
  cfg, json, env, clean, hash, safeEqual, isClosed, LIMITS, UPLOAD_WINDOW_MS,
  responsesStore, tokensStore,
} from "../../lib/shared.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);
  if (isClosed()) return json({ error: "Entries are closed now." }, 403);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "The form data could not be read. Refresh the page and try again." }, 400);
  }

  // Bots fill every field, including this hidden one.
  if (body.website) return json({ ok: true, id: null });

  const code = env("ACCESS_CODE");
  if (code && !safeEqual(clean(body.accessCode, 100).toLowerCase(), code.toLowerCase())) {
    return json({ error: "That access code doesn't match. Check the code in the invite and try again." }, 403);
  }

  const answers = {};
  for (const q of cfg.questions) {
    const v = clean(body.answers?.[q.id], LIMITS[q.kind] ?? LIMITS.long);
    if (v) answers[q.id] = v;
  }

  const photosPlanned = Math.max(0, Math.min(cfg.maxPhotos, parseInt(body.photoCount, 10) || 0));
  if (Object.keys(answers).length === 0 && photosPlanned === 0) {
    return json({ error: "Answer at least one question or add a photo before sending." }, 400);
  }

  const anonymous = body.anonymous !== false;
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const id = crypto.randomUUID();

  const record = {
    id,
    anonymous,
    day,
    answers,
    showOnWall: !!cfg.wallEnabled && body.showOnWall === true,
    hiddenFromWall: false,
    starred: false,
  };

  if (anonymous) {
    // Anonymous entries keep only the date, never the exact time, so they
    // can't be matched to who was online at a given moment.
  } else {
    record.createdAt = now.toISOString();
    record.name = clean(body.name, LIMITS.field);
    record.role = clean(body.role, LIMITS.field);
    record.team = clean(body.team, LIMITS.field);
    record.tenure = clean(body.tenure, 20);
    const linkedin = clean(body.linkedin, LIMITS.url);
    const email = clean(body.email, LIMITS.field);
    if (linkedin || email) record.contact = { linkedin, email };
  }

  await responsesStore().setJSON(id, record);

  let uploadToken = null;
  if (photosPlanned > 0) {
    uploadToken = crypto.randomBytes(24).toString("hex");
    await tokensStore().setJSON(id, {
      hash: hash(uploadToken),
      allowed: photosPlanned,
      expires: Date.now() + UPLOAD_WINDOW_MS,
    });
  }

  return json({ ok: true, id, uploadToken });
};

export const config = { path: "/api/submit" };
