import { cfg, json, loadAll, photoIndex, responsesStore } from "../../lib/shared.mjs";

export default async () => {
  if (!cfg.wallEnabled) return json({ error: "The Memory Wall is turned off." }, 404);

  const wallQs = cfg.questions.filter((q) => q.wall).map((q) => q.id);
  const [all, photos] = await Promise.all([loadAll(responsesStore()), photoIndex()]);

  const entries = all
    .filter((r) => r.showOnWall && !r.hiddenFromWall)
    .map((r) => {
      const answers = {};
      for (const id of wallQs) if (r.answers?.[id]) answers[id] = r.answers[id];
      return {
        id: r.id,
        day: r.day,
        name: r.anonymous ? null : r.name || null,
        team: r.anonymous ? null : r.team || null,
        answers,
        photos: photos[r.id] || [],
      };
    })
    .filter((e) => Object.keys(e.answers).length || e.photos.length)
    .sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0));

  return json(
    { questions: cfg.questions.filter((q) => q.wall), entries },
    200,
    { "cache-control": "public, max-age=60" }
  );
};

export const config = { path: "/api/wall" };
