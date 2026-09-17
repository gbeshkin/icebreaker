"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, LoaderCircle, Send, Sparkles } from "lucide-react";

type Entry = { id: number; name: string; cardId: number; answer: string; createdAt: string };
const cardTitles = ["Beacon above the clouds", "The open door", "Constellation whale", "Paper boat city", "The moon handlers", "Waterfall stairway", "The keeper of keys", "Rainbow crossing", "Time falls", "City in a bottle", "Rain in reverse", "Morning in your hand", "Lantern sea", "Rooms of every season", "The book takes flight", "The underwater library", "Sleeping mountain", "A door of water", "The wandering shadow", "Cloud-rooted tree", "Golden pond", "The suitcase tower", "Village in an eye", "The suspended road"];
function cardStyle(cardId: number) { const deck = Math.floor(cardId / 8) + 1; const position = cardId % 8; const row = Math.floor(position / 2); return { backgroundImage: `url(/cards/deck-0${deck}.png)`, backgroundSize: "200% 400%", backgroundPosition: `${(position % 2) * 100}% ${(row / 3) * 100}%` }; }
function DreamCard({ cardId, small = false }: { cardId: number; small?: boolean }) { return <div className={`dream-card ${small ? "dream-card-small" : ""}`} style={cardStyle(cardId)} role="img" aria-label={cardTitles[cardId]} />; }

export default function Home() {
  const [name, setName] = useState(""); const [selectedCard, setSelectedCard] = useState<number | null>(null); const [usedCards, setUsedCards] = useState<number[]>([]); const [answer, setAnswer] = useState(""); const [entries, setEntries] = useState<Entry[]>([]); const [loadingFeed, setLoadingFeed] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const remaining = useMemo(() => cardTitles.map((_, i) => i).filter((id) => !usedCards.includes(id)), [usedCards]);
  async function loadEntries() { try { const response = await fetch("/api/entries", { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not load the gallery."); setEntries(data.entries ?? []); setError(""); } catch (err) { setError(err instanceof Error ? err.message : "Could not load the gallery."); } finally { setLoadingFeed(false); } }
  useEffect(() => { const refresh = () => void loadEntries(); const initialLoad = window.setTimeout(refresh, 0); const interval = window.setInterval(refresh, 10000); return () => { window.clearTimeout(initialLoad); window.clearInterval(interval); }; }, []);
  useEffect(() => {
    type Tool = { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => Promise<unknown> | unknown };
    type Context = { registerTool: (tool: Tool, options: { signal: AbortSignal }) => void | Promise<void> };
    const context = (document as Document & { modelContext?: Context }).modelContext;
    if (!context) return;
    const lifecycle = new AbortController();
    const draw = (input: unknown) => {
      const guest = typeof (input as { name?: unknown }).name === "string" ? (input as { name: string }).name.trim() : "";
      if (!guest) throw new Error("name is required");
      const pool = remaining.length ? remaining : cardTitles.map((_, i) => i);
      const next = pool[Math.floor(Math.random() * pool.length)];
      setName(guest); setSelectedCard(next); setUsedCards((previous) => [...previous, next]); setAnswer("");
      return { cardId: next, title: cardTitles[next] };
    };
    void Promise.resolve(context.registerTool({ name: "draw_icebreaker_card", title: "Draw a card", description: "Draw a new original surreal card for a named participant.", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: draw }, { signal: lifecycle.signal })).catch(() => undefined);
    void Promise.resolve(context.registerTool({ name: "refresh_icebreaker_gallery", title: "Refresh gallery", description: "Read the latest shared interpretations in the visible gallery.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: true }, execute: async () => { await loadEntries(); return { refreshed: true, entries: entries.length }; } }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [entries.length, remaining]);
  function drawCard() { const pool = remaining.length ? remaining : cardTitles.map((_, i) => i); const next = pool[Math.floor(Math.random() * pool.length)]; setSelectedCard(next); setUsedCards((previous) => [...previous, next]); setAnswer(""); setError(""); }
  async function shareInterpretation(event: FormEvent) { event.preventDefault(); if (selectedCard === null || !name.trim() || !answer.trim()) return; setSaving(true); setError(""); try { const response = await fetch("/api/entries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), cardId: selectedCard, answer: answer.trim() }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Your interpretation could not be shared."); setEntries((previous) => [data.entry, ...previous]); setAnswer(""); } catch (err) { setError(err instanceof Error ? err.message : "Your interpretation could not be shared."); } finally { setSaving(false); } }
  return <main><div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="site-header"><a className="brand" href="#top"><span className="brand-orb"><Eye size={18} /></span> What Do You See?</a><span className="header-note">A shared imagination exercise</span></header>
    <section id="top" className="hero shell"><div className="hero-copy"><p className="eyebrow"><Sparkles size={15} /> Team icebreaker</p><h1>What Do You<br /><em>See?</em></h1><p className="lead">Draw a card, trust your first impression, and describe what you see.</p><div className="tiny-rule"><span /> Take 60 seconds. Follow your first thought.</div></div>
      <div className="play-panel">{selectedCard === null ? <div className="start-state"><div className="mini-deck" aria-hidden="true"><span style={cardStyle(18)} /><span style={cardStyle(5)} /><span style={cardStyle(11)} /></div><h2>Ready for a new point of view?</h2><label htmlFor="name">Your name</label><input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Maya" maxLength={60} /><button className="primary-button" onClick={drawCard} disabled={!name.trim()}>Draw my card <ArrowRight size={18} /></button><p className="availability">{remaining.length || cardTitles.length} unseen cards in this session</p></div> : <form className="card-state" onSubmit={shareInterpretation}><div className="selected-top"><span>Your card</span><button type="button" className="link-button" onClick={drawCard}>Draw another card</button></div><DreamCard cardId={selectedCard} /><p className="card-title">{cardTitles[selectedCard]}</p><label htmlFor="answer">What story, feeling, or idea does it give you?</label><textarea id="answer" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="I see…" maxLength={600} rows={3} /><button className="primary-button" type="submit" disabled={!answer.trim() || saving}>{saving ? <LoaderCircle className="spin" size={18} /> : <Send size={17} />} {saving ? "Sharing…" : "Share my interpretation"}</button></form>}{error && <p className="error-message" role="alert">{error}</p>}</div>
    </section>
    <section className="gallery-section shell" aria-labelledby="gallery-title"><div className="section-heading"><div><p className="eyebrow"><span className="pulse-dot" /> Shared gallery</p><h2 id="gallery-title">Perspectives in the room</h2></div><button className="refresh-button" onClick={() => void loadEntries()}>Refresh</button></div>{loadingFeed ? <div className="gallery-empty">Gathering the room’s first impressions…</div> : entries.length === 0 ? <div className="gallery-empty"><Sparkles size={22} /><p>The gallery is waiting for its first interpretation.</p></div> : <div className="feed-grid">{entries.map((entry) => <article className="entry" key={entry.id}><DreamCard cardId={entry.cardId} small /><div className="entry-copy"><p className="entry-name">{entry.name}</p><p className="entry-answer">“{entry.answer}”</p></div></article>)}</div>}</section>
    <footer>There are no wrong answers. Different perspectives help us notice more.</footer>
  </main>;
}
