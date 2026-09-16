export const config = { path: "/api/show-pulse" };

const jsonHeaders = { "cache-control": "no-store" };

function json(data, status = 200) {
  return Response.json(data, { status, headers: jsonHeaders });
}

function clean(value, max) {
  return String(value || "")
    .replace(/\+?1?\d{7,15}/g, "[redacted]")
    .replace(/[\u0000-\u001f]/g, " ")
    .trim()
    .slice(0, max);
}

export default async (req) => {
  if (req.method === "GET") {
    return json({ ok: Boolean(process.env.OPENAI_API_KEY), ready: Boolean(process.env.OPENAI_API_KEY) });
  }

  if (req.method !== "POST") return json({ ok: false, line: "Use POST." }, 405);

  const key = String(process.env.OPENAI_API_KEY || "").trim();
  if (!key) {
    return json({
      ok: false,
      ready: false,
      line: "Pulse is waiting for OPENAI_API_KEY on the Netlify site. Add that name in site env. Do not paste the key into the page or chat.",
    }, 503);
  }

  const body = await req.json().catch(() => ({}));
  const now = clean(body.now, 16);
  const marks = Array.isArray(body.marks) ? body.marks.slice(0, 40) : [];
  const upcoming = Array.isArray(body.upcoming) ? body.upcoming.slice(0, 8) : [];
  const safeMarks = marks.map((row) => ({
    t: clean(row && row.t, 8),
    who: clean(row && row.who, 48),
    text: clean(row && row.text, 160),
    state: /^(done|late|skip)$/.test(String((row && row.state) || "")) ? row.state : "done",
  }));
  const safeUpcoming = upcoming.map((row) => ({
    t: clean(row && row.t, 8),
    who: clean(row && row.who, 48),
    text: clean(row && row.text, 160),
  }));

  const prompt =
    "Phone clock: " +
    now +
    "\nMarked: " +
    JSON.stringify(safeMarks) +
    "\nNext: " +
    JSON.stringify(safeUpcoming) +
    "\nSay if Grassroots & Guitar Strings is on time, ahead, or behind. One short status word. One sentence. Then three next moves. No names of guests. No phone numbers. No opponent talk. No invented facts.";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: "Bearer " + key,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "You are the run-of-show observer for a hometown concert. Be blunt and short. JSON only: {\"status\":\"on_time|ahead|behind|smooth|rough\",\"minutes\":0,\"line\":\"...\",\"moves\":[\"...\",\"...\",\"...\"]}",
          },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!response.ok) return json({ ok: false, ready: true, line: "Pulse could not read the clock just now. Keep marking Done and Late." }, 502);
    const data = await response.json();
    const raw = String((data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "").trim();
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const parsed = JSON.parse(start >= 0 ? raw.slice(start, end + 1) : "{}");
    return json({
      ok: true,
      ready: true,
      status: clean(parsed.status, 16) || "smooth",
      minutes: Number(parsed.minutes) || 0,
      line: clean(parsed.line, 240) || "Clock is live. Keep marking what actually happened.",
      moves: Array.isArray(parsed.moves) ? parsed.moves.map((item) => clean(item, 120)).filter(Boolean).slice(0, 3) : [],
    });
  } catch (err) {
    return json({ ok: false, ready: true, line: "Pulse is quiet. Use the highlighted row and keep moving." }, 502);
  }
};
