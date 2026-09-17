"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, Sparkles } from "lucide-react";

const cardTitles = ["Beacon above the clouds", "The open door", "Constellation whale", "Paper boat city", "The moon handlers", "Waterfall stairway", "The keeper of keys", "Rainbow crossing", "Time falls", "City in a bottle", "Rain in reverse", "Morning in your hand", "Lantern sea", "Rooms of every season", "The book takes flight", "The underwater library", "Sleeping mountain", "A door of water", "The wandering shadow", "Cloud-rooted tree", "Golden pond", "The suitcase tower", "Village in an eye", "The suspended road"];
function cardStyle(cardId: number) { const deck = Math.floor(cardId / 8) + 1; const position = cardId % 8; const row = Math.floor(position / 2); return { backgroundImage: `url(/cards/deck-0${deck}.png)`, backgroundSize: "200% 400%", backgroundPosition: `${(position % 2) * 100}% ${(row / 3) * 100}%` }; }
function DreamCard({ cardId }: { cardId: number }) { return <div className="dream-card" style={cardStyle(cardId)} role="img" aria-label={cardTitles[cardId]} />; }

export default function Home() {
  const [name, setName] = useState(""); const [selectedCard, setSelectedCard] = useState<number | null>(null); const [usedCards, setUsedCards] = useState<number[]>([]);
  const remaining = useMemo(() => cardTitles.map((_, i) => i).filter((id) => !usedCards.includes(id)), [usedCards]);
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
      setName(guest); setSelectedCard(next); setUsedCards((previous) => [...previous, next]);
      return { cardId: next, title: cardTitles[next] };
    };
    void Promise.resolve(context.registerTool({ name: "draw_icebreaker_card", title: "Draw a card", description: "Draw a new original surreal card for a named participant.", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: draw }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [remaining]);
  function drawCard() { const pool = remaining.length ? remaining : cardTitles.map((_, i) => i); const next = pool[Math.floor(Math.random() * pool.length)]; setSelectedCard(next); setUsedCards((previous) => [...previous, next]); }
  return <main><div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="site-header"><a className="brand" href="#top"><span className="brand-orb"><Eye size={18} /></span> What Do You See?</a><span className="header-note">A shared imagination exercise</span></header>
    <section id="top" className="hero shell"><div className="hero-copy"><p className="eyebrow"><Sparkles size={15} /> Team icebreaker</p><h1>What Do You<br /><em>See?</em></h1><p className="lead">Draw a card, trust your first impression, and connect it to a moment from your life or work. What does it remind you of?</p><div className="tiny-rule"><span /> Take 60 seconds. Follow your first thought.</div></div>
      <div className="play-panel">{selectedCard === null ? <div className="start-state"><div className="mini-deck" aria-hidden="true"><span style={cardStyle(18)} /><span style={cardStyle(5)} /><span style={cardStyle(11)} /></div><h2>Ready for a new point of view?</h2><label htmlFor="name">Your name</label><input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Maya" maxLength={60} /><button className="primary-button" onClick={drawCard} disabled={!name.trim()}>Draw my card <ArrowRight size={18} /></button><p className="availability">{remaining.length || cardTitles.length} unseen cards in this session</p></div> : <div className="card-state"><div className="selected-top"><span>Your card</span><button type="button" className="link-button" onClick={drawCard}>Draw another card</button></div><DreamCard cardId={selectedCard} /></div>}</div>
    </section>
    <footer>Created by G. Beshkin</footer>
  </main>;
}
