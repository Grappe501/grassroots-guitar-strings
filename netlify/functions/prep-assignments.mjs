import { getDatabase } from "@netlify/database";

export const config = { path: "/api/prep-assignments" };

const jsonHeaders = { "cache-control": "no-store" };

function cleanKey(value) {
  return String(value || "")
    .trim()
    .slice(0, 120);
}

function cleanText(value, max) {
  return String(value || "")
    .replace(/[\u0000-\u001f]/g, " ")
    .trim()
    .slice(0, max);
}

function json(data, status = 200) {
  return Response.json(data, { status, headers: jsonHeaders });
}

export default async (req) => {
  try {
    const db = getDatabase();

    if (req.method === "GET") {
      let rows;
      try {
        rows = await db.sql`SELECT task_key, owner, due_when, done, extra FROM prep_assignments`;
      } catch (err) {
        rows = await db.sql`SELECT task_key, owner, due_when, done FROM prep_assignments`;
      }
      const assignments = {};
      for (const row of rows) {
        assignments[row.task_key] = {
          owner: row.owner || "",
          when: row.due_when || "",
          done: Boolean(row.done),
          extra: row.extra || "",
        };
      }
      return json({ assignments });
    }

    if (req.method === "PUT" || req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const incoming =
        body.assignments && typeof body.assignments === "object"
          ? Object.entries(body.assignments).map(([key, row]) => ({ key, ...(row || {}) }))
          : [body];
      if (!incoming.length) return json({ error: "key required" }, 400);
      for (const item of incoming) {
        const key = cleanKey(item.key);
        if (!key) continue;
        const owner = cleanText(item.owner, 80);
        const when = cleanText(item.when, 40);
        const extra = cleanText(item.extra, 20000);
        const done = Boolean(item.done);
        try {
          await db.sql`
            INSERT INTO prep_assignments (task_key, owner, due_when, done, extra)
            VALUES (${key}, ${owner}, ${when}, ${done}, ${extra})
            ON CONFLICT (task_key) DO UPDATE SET
              owner = EXCLUDED.owner,
              due_when = EXCLUDED.due_when,
              done = EXCLUDED.done,
              extra = EXCLUDED.extra,
              updated_at = NOW()
          `;
        } catch (err) {
          await db.sql`
            INSERT INTO prep_assignments (task_key, owner, due_when, done)
            VALUES (${key}, ${owner}, ${when}, ${done})
            ON CONFLICT (task_key) DO UPDATE SET
              owner = EXCLUDED.owner,
              due_when = EXCLUDED.due_when,
              done = EXCLUDED.done,
              updated_at = NOW()
          `;
        }
      }
      return json({ ok: true });
    }

    if (req.method === "DELETE") {
      const body = await req.json().catch(() => ({}));
      const keys = Array.isArray(body.keys) ? body.keys.map(cleanKey).filter(Boolean) : [];
      if (keys.length) {
        for (const key of keys) {
          await db.sql`DELETE FROM prep_assignments WHERE task_key = ${key}`;
        }
        return json({ ok: true });
      }
      await db.sql`DELETE FROM prep_assignments`;
      return json({ ok: true });
    }

    return new Response("Method not allowed", { status: 405, headers: jsonHeaders });
  } catch (err) {
    return json({ error: "shared board unavailable" }, 500);
  }
};
