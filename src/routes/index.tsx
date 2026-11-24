import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EyeOff, MapPin, Clock, TrendingDown, ArrowRight } from "lucide-react";
import hero from "@/assets/hero-farmer-market.jpg";
import { inr } from "@/lib/markets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MarketMind — Know where to sell before you sell" },
      { name: "description", content: "Compare live mandi crop prices across markets and subtract transport to see which market really pays more." },
      { property: "og:title", content: "MarketMind — Know where to sell before you sell" },
      { property: "og:description", content: "Live mandi prices, net returns after transport, and a clear best-market suggestion for farmers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const problems = [
  { icon: EyeOff, t: "Price blind spots", d: "Limited visibility into current prices and trends." },
  { icon: MapPin, t: "Market differences", d: "Nearby markets pay different prices for the same crop." },
  { icon: Clock, t: "Timing uncertainty", d: "Sell today, or wait a few days? Hard to know." },
  { icon: TrendingDown, t: "The outcome", d: "Lower profits, poor decisions and financial losses." },
];
const example = [
  { m: "Market A (local)", km: 5, v: 17800 },
  { m: "Market B", km: 40, v: 21400 },
  { m: "Market C", km: 65, v: 23100 },
];

function Index() {
  return (
    <>
      <section className="relative min-h-[78vh] overflow-hidden">
        <img src={hero} alt="Farmer holding a crate of fresh tomatoes at a village market at sunrise" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-4 py-20 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Farmer market intelligence</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight md:text-7xl">Know where to sell <em className="text-accent">before</em> you sell.</h1>
          <p className="mt-6 max-w-xl text-lg opacity-90">MarketMind pulls today's mandi prices, compares markets and subtracts transport cost — so you see which market really pays more.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/demo">Check live prices <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/features">How it works</Link></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="eyebrow">The problem</p>
        <h2 className="mt-2 max-w-xl text-4xl font-semibold">Farmers often sell without the full picture.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p) => (
            <div key={p.t} className="rounded-xl border bg-card p-6 shadow-soft">
              <p.icon className="h-6 w-6 text-tomato" />
              <h3 className="mt-4 text-xl font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-3">
          {[["01", "Compare markets", "See today's price for your crop across every reporting mandi in your state."], ["02", "Estimate returns", "Enter distance and transport rate to see what actually reaches your pocket."], ["03", "Sell smarter", "Get a clear suggestion for the best-paying market."]].map(([n, t, d]) => (
            <div key={n}>
              <span className="font-display text-5xl text-accent">{n}</span>
              <h3 className="mt-3 text-2xl font-semibold">{t}</h3>
              <p className="mt-2 opacity-80">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2">
        <div>
          <p className="eyebrow">Illustrative example</p>
          <h2 className="mt-2 text-4xl font-semibold">The nearest market isn't always the best.</h2>
          <p className="mt-4 text-muted-foreground">10 quintals of tomato. After transport, Market C returns <strong className="text-foreground">₹5,300 more</strong> than the local market.</p>
          <p className="mt-4 rounded-lg bg-secondary px-4 py-3 font-mono text-sm">Net return = price × quantity − transport</p>
          <Button asChild className="mt-6"><Link to="/demo">Run your own numbers</Link></Button>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-soft">
          <p className="text-sm font-medium text-muted-foreground">Tomato · 10 quintals</p>
          <div className="mt-4 space-y-4">
            {example.map((e) => (
              <div key={e.m}>
                <div className="flex justify-between text-sm"><span>{e.m} · {e.km} km</span><strong>{inr(e.v)}</strong></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(e.v / 23100) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
