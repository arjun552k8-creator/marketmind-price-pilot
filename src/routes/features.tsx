import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — MarketMind" },
      { name: "description", content: "Live mandi price comparison, net-return calculation and selling suggestions for farmers." },
      { property: "og:title", content: "Features — MarketMind" },
      { property: "og:description", content: "Everything a farmer needs to decide where to sell." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Features,
});

const features: [string, string, string][] = [
  ["Live", "Market price comparison", "Today's prices for the same crop across mandis in your state, from Agmarknet."],
  ["Live", "Price range view", "Minimum, modal and maximum price reported at each market."],
  ["Live", "Net-return calculation", "Price × quantity − transport cost, recalculated instantly."],
  ["Live", "Selling recommendation", "The market that leaves the most money in your hand."],
  ["Live", "Farmer-friendly dashboard", "Prices, charts and comparisons in one mobile-friendly screen."],
  ["Planned", "Short-term prediction", "Estimate near-term price movement from history."],
  ["Planned", "Alerts", "Target-price and price-change alerts."],
  ["Roadmap", "Regional language & voice", "Tamil, Hindi and voice access for mobile users."],
];

function Features() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="eyebrow">Features</p>
      <h1 className="mt-2 max-w-2xl text-5xl font-semibold">Everything a farmer needs to decide where to sell.</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">Built around one question: after transport, which market leaves the most money in my hand?</p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(([tag, t, d]) => (
          <div key={t} className="rounded-xl border bg-card p-6">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tag === "Live" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{tag}</span>
            <h3 className="mt-4 text-xl font-semibold">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-20 text-3xl font-semibold">From raw prices to a clear suggestion.</h2>
      <ol className="mt-6 grid gap-3 md:grid-cols-2">
        {["Fetch today's mandi prices from data.gov.in (Agmarknet)", "Filter by your crop and state", "Compare modal prices across markets", "Add your distance and transport rate", "Calculate net return per market", "Highlight the best-paying market"].map((s, i) => (
          <li key={s} className="flex gap-4 rounded-lg bg-secondary/60 p-4"><span className="font-display text-2xl text-primary">0{i + 1}</span><span className="self-center">{s}</span></li>
        ))}
      </ol>
    </div>
  );
}
