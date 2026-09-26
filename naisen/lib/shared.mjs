import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import cfg from "../site.config.mjs";

export { cfg };

export const LIMITS = { long: 3000, short: 300, word: 40, field: 120, url: 300 };
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const UPLOAD_WINDOW_MS = 30 * 60 * 1000;

export const responsesStore = () => getStore({ name: "responses", consistency: "strong" });
export const photosStore = () => getStore({ name: "photos", consistency: "strong" });
export const tokensStore = () => getStore({ name: "upload-tokens", consistency: "strong" });

export const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
  });

export const env = (name) => (process.env[name] || "").trim();

const digest = (s) => crypto.createHash("sha256").update(String(s)).digest();
export const safeEqual = (a, b) => crypto.timingSafeEqual(digest(a), digest(b));
export const hash = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");

export function isAdmin(req) {
  const expected = env("ADMIN_PASSWORD");
  if (!expected) return false;
  const given = req.headers.get("x-admin-password") || "";
  return given.length > 0 && safeEqual(given, expected);
}

export function isClosed() {
  if (!cfg.closesOn) return false;
  const end = new Date(`${cfg.closesOn}T23:59:59+05:30`);
  return !Number.isNaN(end.getTime()) && Date.now() > end.getTime();
}

export function clean(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/\u0000/g, "").trim().slice(0, max);
}

export const validId = (id) => typeof id === "string" && /^[0-9a-f-]{36}$/.test(id);

export async function listKeys(store, prefix) {
  const { blobs } = await store.list(prefix ? { prefix } : undefined);
  return blobs.map((b) => b.key);
}

export async function loadAll(store) {
  const keys = await listKeys(store);
  const out = [];
  for (let i = 0; i < keys.length; i += 50) {
    const batch = await Promise.all(keys.slice(i, i + 50).map((k) => store.get(k, { type: "json" })));
    out.push(...batch.filter(Boolean));
  }
  return out;
}

// Photos are stored as "<responseId>/<file>". Returns { responseId: [keys] }.
export async function photoIndex() {
  const keys = await listKeys(photosStore());
  const map = {};
  for (const k of keys) {
    const id = k.split("/")[0];
    (map[id] ||= []).push(k);
  }
  for (const id in map) map[id].sort();
  return map;
}

export function publicConfig() {
  return {
    appName: cfg.appName,
    leaderName: cfg.leaderName,
    pageTitle: cfg.pageTitle,
    headline: cfg.headline,
    farewell: cfg.farewell,
    formIntro: cfg.formIntro,
    contact: cfg.contact || {},
    inviteMessage: cfg.inviteMessage,
    headcount: cfg.headcount,
    closesOn: cfg.closesOn,
    closed: isClosed(),
    wallEnabled: !!cfg.wallEnabled,
    teams: cfg.teams || [],
    maxPhotos: cfg.maxPhotos,
    questions: cfg.questions,
    accessCodeRequired: !!env("ACCESS_CODE"),
  };
}
