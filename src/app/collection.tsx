import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/auth/client";

export const Route = createFileRoute("/collection")({
  component: CollectionPage,
});

function CollectionPage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <Shell><Skeleton /></Shell>;

  if (!session?.user) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="text-6xl text-muted-foreground/20">&#x1f512;</div>
          <h1 className="text-2xl font-bold tracking-tight">Sign In Required</h1>
          <p className="text-muted-foreground max-w-md">
            Sign in to view your QR code collection and download history.
          </p>
          <a href="/auth" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
            Sign In
          </a>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Collection</h1>
          <p className="text-muted-foreground text-sm mt-1">View and re-download your QR codes</p>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="text-muted-foreground">QR Credits: <strong>5</strong></span>
          <span className="text-muted-foreground">AI Credits: <strong>1</strong></span>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="px-6 py-4 border-b font-semibold text-sm">Recent QR Codes</div>
        <div className="p-8 text-center">
          <div className="text-4xl text-muted-foreground/20 mb-3">&#x1f4dc;</div>
          <p className="text-muted-foreground text-sm mb-4">Your generated QR codes will appear here.</p>
          <a href="/generate?tab=custom" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
            Create Your First QR Code
          </a>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="px-6 py-4 border-b font-semibold text-sm">Payment History</div>
        <div className="p-8 text-center text-sm text-muted-foreground">
          No payment transactions yet.
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">{children}</div>;
}

function Skeleton() {
  return (
    <>
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />
      <div className="h-64 bg-muted rounded-xl animate-pulse" />
      <div className="h-48 bg-muted rounded-xl animate-pulse" />
    </>
  );
}
