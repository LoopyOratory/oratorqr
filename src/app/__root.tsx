import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "./globals.css?url";
import { Providers } from "@/components/providers";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { useTheme } from "@/components/providers";
import { useSession } from "@/auth/client";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
      },
      { name: "theme-color", content: "#000000" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { title: "Orator QR — AI & Parametric QR Code Generator" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            Orator QR
          </a>
          <nav className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <a href="/generate" className="hover:text-foreground transition-colors">
              Generate
            </a>
            <a href="/collection" className="hover:text-foreground transition-colors">
              Collection
            </a>
            <a href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthSection />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>Orator QR — AI & Parametric QR Code Generator</div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme() as {
    resolvedTheme: "light" | "dark";
    setTheme: (t: string) => void;
  };

  return (
    <button
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function AuthSection() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />;
  }

  if (!session?.user) {
    return <SignInButton />;
  }

  return <UserMenu />;
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
