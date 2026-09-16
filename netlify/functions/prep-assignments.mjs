import { getDatabase } from "@netlify/database";

export const config = { path: "/api/prep-assignments" };

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

export default async (req) => {
  const db = getDatabase();

  if (req.method === "GET") {
    const rows = await db.sql`SELECT task_key, owner, due_when, done FROM prep_assignments`;
    const assignments = {};
    for (const row of rows) {
      assignments[row.task_key] = {
        owner: row.owner || "",
        when: row.due_when || "",
        done: Boolean(row.done),
      };
    }
    return Response.json({ assignments });
  }

  if (req.method === "PUT" || req.method === "POST") {
    const body = await req.json().catch(() => ({}));
    const incoming = body.assignments && typeof body.assignments === "object"
      ? Object.entries(body.assignments).map(([key, row]) => ({ key, ...(row || {}) }))
      : [body];
    if (!incoming.length) return Response.json({ error: "key required" }, { status: 400 });
    for (const item of incoming) {
      const key = cleanKey(item.key);
      if (!key) continue;
      const owner = cleanText(item.owner, 80);
      const when = cleanText(item.when, 40);
      const done = Boolean(item.done);
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
    return Response.json({ ok: true });
  }

  if (req.method === "DELETE") {
    await db.sql`DELETE FROM prep_assignments`;
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};
