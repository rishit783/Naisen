import { json, publicConfig } from "../../lib/shared.mjs";

export default async () => json(publicConfig());

export const config = { path: "/api/config" };
