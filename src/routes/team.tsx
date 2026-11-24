import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team AGRINYX — MarketMind" },
      { name: "description", content: "MarketMind is built by Team AGRINYX, first-year ECE students, for farmers. Aligned with SDG 2.3." },
      { property: "og:title", content: "Team AGRINYX — MarketMind" },
      { property: "og:description", content: "Built by students, for farmers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Team,
});

const team = ["Arjun M P", "Kavin T", "Sanmathikha M", "Kavyasri B"];

function Team() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="eyebrow">Team AGRINYX · COMPUTE 50 Hackathon</p>
      <h1 className="mt-2 text-5xl font-semibold">Built by students, for farmers.</h1>
      <p className="mt-4 text-muted-foreground">ECE, 1st year. Domain: Agriculture & Rural Innovation.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((n) => (
          <div key={n} className="rounded-xl border bg-card p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground">{n.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
            <h3 className="mt-4 text-lg font-semibold">{n}</h3>
            <p className="text-sm text-muted-foreground">ECE · 1st Year</p>
          </div>
        ))}
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-primary p-8 text-primary-foreground">
          <span className="font-display text-6xl text-accent">2</span>
          <h2 className="mt-2 text-2xl font-semibold">Zero Hunger, Target 2.3</h2>
          <p className="mt-2 opacity-85">Raising the incomes of small-scale food producers through better access to market information.</p>
        </div>
        <div className="rounded-xl border bg-card p-8">
          <h2 className="text-2xl font-semibold">Limitations</h2>
          <p className="mt-2 text-muted-foreground">Prices come from markets reporting to Agmarknet and may be delayed or incomplete. Suggestions are decision support, not a guarantee of price or profit. Verify prices and transport costs before selling.</p>
        </div>
      </div>
    </div>
  );
}
