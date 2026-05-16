import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/auth/client";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <DashboardShell><Skeleton /></DashboardShell>;

  if (!session?.user) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="text-6xl text-muted-foreground/20">&#x1f512;</div>
          <h1 className="text-2xl font-bold tracking-tight">Sign In Required</h1>
          <p className="text-muted-foreground max-w-md">Sign in with Google to access your dashboard and track credits.</p>
          <a href="/generate" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">Go to Generator</a>
        </div>
      </DashboardShell>
    );
  }

  const user = session.user;

  return (
    <DashboardShell>
      <div className="flex items-center gap-4">
        {user.image ? <img src={user.image} alt="" className="w-12 h-12 rounded-full" />
          : <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">{(user.name || user.email || "U")[0].toUpperCase()}</div>}
        <div><h1 className="text-2xl font-bold tracking-tight">{user.name || "Welcome"}</h1><p className="text-sm text-muted-foreground">{user.email}</p></div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="QR Credits" value="5" sub="Simple QR codes remaining" />
        <Stat label="AI Credits" value="1" sub="AI QR codes remaining" />
        <Stat label="Total Generated" value="0" sub="All-time" />
      </div>
      <div className="rounded-xl border"><div className="px-6 py-4 border-b font-semibold">Recent Generations</div><div className="p-6 text-center"><p className="text-muted-foreground">Your generated QR codes will appear here.</p><a href="/generate" className="inline-block mt-4 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">Create Your First QR Code</a></div></div>
      <div className="rounded-xl border"><div className="px-6 py-4 border-b font-semibold">Credit History</div><div className="p-6 text-center text-sm text-muted-foreground">No transactions yet.</div></div>
    </DashboardShell>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">{children}</div>;
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="rounded-xl border p-4 space-y-1"><div className="text-sm text-muted-foreground">{label}</div><div className="text-3xl font-bold">{value}</div><div className="text-xs text-muted-foreground">{sub}</div></div>;
}

function Skeleton() {
  return <><div className="h-8 w-48 bg-muted rounded animate-pulse" /><div className="grid sm:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="rounded-xl border p-4 space-y-1"><div className="h-4 w-20 bg-muted rounded animate-pulse" /><div className="h-8 w-12 bg-muted rounded animate-pulse" /></div>)}</div></>;
}
