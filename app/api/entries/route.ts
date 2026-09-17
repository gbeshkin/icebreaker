import { getDatabase } from "../../../db";

const CARD_COUNT = 24;
export const dynamic = "force-dynamic";
function errorMessage(error: unknown) {
  if (error instanceof Error && error.message.includes("not configured")) return "The shared gallery is being configured. Please try again in a moment.";
  return "The shared gallery is temporarily unavailable. Please try again in a moment.";
}
export async function GET() {
  try {
    const results = await getDatabase().query("SELECT id, name, card_id AS \"cardId\", answer, created_at AS \"createdAt\" FROM interpretations ORDER BY id DESC LIMIT 60");
    return Response.json({ entries: results.rows });
  } catch (error) { return Response.json({ error: errorMessage(error) }, { status: 500 }); }
}
export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: unknown; cardId?: unknown; answer?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const answer = typeof body.answer === "string" ? body.answer.trim() : "";
    const cardId = typeof body.cardId === "number" ? body.cardId : -1;
    if (!name || !answer || cardId < 0 || cardId >= CARD_COUNT || !Number.isInteger(cardId)) return Response.json({ error: "Please add your name and a short interpretation." }, { status: 400 });
    if (name.length > 60 || answer.length > 600) return Response.json({ error: "Please keep your response a little shorter." }, { status: 400 });
    const saved = await getDatabase().query("INSERT INTO interpretations (name, card_id, answer) VALUES ($1, $2, $3) RETURNING id, name, card_id AS \"cardId\", answer, created_at AS \"createdAt\"", [name, cardId, answer]);
    return Response.json({ entry: saved.rows[0] }, { status: 201 });
  } catch (error) { return Response.json({ error: errorMessage(error) }, { status: 500 }); }
}
