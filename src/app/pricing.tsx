import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const plans = [
  { name: "Free", price: "$0", period: "forever", simpleCredits: 5, aiCredits: 1, features: ["5 simple QR codes / month", "1 AI QR code (trial)", "All parametric styles", "JPG & PNG downloads"], popular: false },
  { name: "QR Pro", price: "$9", period: "month", simpleCredits: 200, aiCredits: 0, features: ["200 simple QR codes / month", "SVG vector downloads", "Custom logo embedding", "Batch generation", "QR scan analytics", "Template gallery"], popular: false },
  { name: "AI Pro", price: "$19", period: "month", simpleCredits: 0, aiCredits: 100, features: ["100 AI QR codes / month", "All AI styles", "Priority generation queue", "Higher resolution output", "SVG vector downloads", "QR scan analytics"], popular: true },
  { name: "Unlimited", price: "$39", period: "month", simpleCredits: 0, aiCredits: 300, features: ["Unlimited simple QR codes", "300 AI QR codes / month", "API access", "Team workspaces", "No watermark", "Priority support"], popular: false },
];

const packs = [
  { name: "QR Credit Pack", desc: "50 simple QR codes, no expiry", price: "$4.99" },
  { name: "AI Credit Pack", desc: "25 AI QR codes, no expiry", price: "$9.99" },
  { name: "Combo Pack", desc: "200 simple + 100 AI, best value", price: "$20" },
];

function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-16">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Choose the plan that fits your needs. Upgrade anytime.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map(p => (
          <div key={p.name} className={`rounded-xl border p-6 flex flex-col gap-4 ${p.popular ? "border-primary ring-1 ring-primary" : "border-border"}`}>
            {p.popular && <div className="text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 self-start">Most Popular</div>}
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <div className="flex items-baseline gap-1"><span className="text-3xl font-bold">{p.price}</span><span className="text-sm text-muted-foreground">/{p.period}</span></div>
            <ul className="space-y-2 text-sm flex-1">
              {p.features.map(f => <li key={f} className="flex items-start gap-2"><svg className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{f}</li>)}
            </ul>
            <button className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border hover:bg-accent"}`}>Subscribe</button>
          </div>
        ))}
      </div>
      <div className="space-y-6">
        <div className="text-center"><h2 className="text-2xl font-bold">Credit Packs</h2><p className="text-muted-foreground text-sm mt-1">One-time purchases. Never expire.</p></div>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {packs.map(p => (
            <div key={p.name} className="rounded-xl border p-5 flex flex-col gap-3 text-center">
              <h3 className="font-semibold">{p.name}</h3>
              <div className="text-2xl font-bold">{p.price}</div>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <button className="mt-auto rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Buy Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
