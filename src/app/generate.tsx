import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useState, useCallback, useRef, createElement, useEffect } from "react";
import { useAtom } from "jotai";
import { urlAtom } from "@/lib/states";
import { useSession } from "@/auth/client";
import { qrbtfModuleA1 } from "@/lib/qrbtf_lib/qrcodes/a1";
import { A1Presets } from "@/lib/qrbtf_lib/qrcodes/a1_config";
import { qrbtfModuleA2 } from "@/lib/qrbtf_lib/qrcodes/a2";
import { A2Presets } from "@/lib/qrbtf_lib/qrcodes/a2_config";
import { qrbtfModuleC2 } from "@/lib/qrbtf_lib/qrcodes/c2";
import { C2Presets } from "@/lib/qrbtf_lib/qrcodes/c2_config";
import { qrbtfModuleSp1 } from "@/lib/qrbtf_lib/qrcodes/sp1";
import { Sp1Presets } from "@/lib/qrbtf_lib/qrcodes/sp1_config";
import { qrbtfModuleA3 } from "@/lib/qrbtf_lib/qrcodes/a3";
import { A3Presets } from "@/lib/qrbtf_lib/qrcodes/a3_config";
import { qrbtfModuleA3R } from "@/lib/qrbtf_lib/qrcodes/a3r";
import { A3RPresets } from "@/lib/qrbtf_lib/qrcodes/a3r_config";
import { qrbtfModuleSp2 } from "@/lib/qrbtf_lib/qrcodes/sp2";
import { Sp2Presets } from "@/lib/qrbtf_lib/qrcodes/sp2_config";
import { qrbtfModuleG1 } from "@/lib/qrbtf_lib/qrcodes/g1";
import { G1Presets } from "@/lib/qrbtf_lib/qrcodes/g1_config";
import { useAiGeneration } from "@/lib/qrbtf_lib/qrcodes/hooks/use_ai_generation";
import { lazy, Suspense } from "react";

const CustomQRTab = lazy(() => import("@/components/qr/CustomQRTab"));

const searchSchema = z.object({
  tab: z.enum(["custom", "simple", "ai"]).default("custom"),
  style: z.string().optional(),
});

export const Route = createFileRoute("/generate")({
  validateSearch: searchSchema,
  component: GeneratePage,
});

const styles: { id: string; name: string; available: boolean }[] = [
  { id: "a1", name: "Basic", available: true },
  { id: "a1c", name: "Circle", available: true },
  { id: "a1p", name: "Planet", available: true },
  { id: "a2", name: "Advanced", available: true },
  { id: "a2c", name: "Cross", available: true },
  { id: "c2", name: "Image", available: true },
  { id: "sp1", name: "X-Mark", available: true },
  { id: "a3", name: "Vortex", available: true },
  { id: "a3r", name: "Circuit", available: true },
  { id: "sp2", name: "Mosaic", available: true },
];

interface ModuleEntry {
  renderer: (props: any) => React.ReactNode;
  presets: Record<string, any>;
  keys: Set<string>;
}

const modules: Record<string, ModuleEntry> = {
  a1: { renderer: qrbtfModuleA1.renderer, presets: A1Presets, keys: new Set(["a1", "a1c", "a1p"]) },
  a2: { renderer: qrbtfModuleA2.renderer, presets: A2Presets, keys: new Set(["a2", "a2c"]) },
  c2: { renderer: qrbtfModuleC2.renderer, presets: C2Presets, keys: new Set(["c2"]) },
  sp1: { renderer: qrbtfModuleSp1.renderer, presets: Sp1Presets, keys: new Set(["sp1"]) },
  a3: { renderer: qrbtfModuleA3.renderer, presets: A3Presets, keys: new Set(["a3"]) },
  a3r: { renderer: qrbtfModuleA3R.renderer, presets: A3RPresets, keys: new Set(["a3r"]) },
  sp2: { renderer: qrbtfModuleSp2.renderer, presets: Sp2Presets, keys: new Set(["sp2"]) },
  g1: { renderer: null as any, presets: G1Presets, keys: new Set(["g1"]) },
};

function findMod(style: string) {
  for (const [, mod] of Object.entries(modules)) {
    if (mod.keys.has(style)) return { mod, preset: (mod.presets as any)[style] };
  }
  return { mod: modules.a1, preset: A1Presets.a1 };
}

function AuthDownloadGate({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (session?.user) {
    return <>{children}</>;
  }

  return (
    <a href="/auth" className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-medium hover:bg-primary/90 transition-colors text-center block">
      Sign in to Download
    </a>
  );
}

function GeneratePage() {
  const { tab, style } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create Your QR Code</h1>
        <p className="text-muted-foreground">Generate beautiful, scannable QR codes with AI or parametric styles</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border bg-muted p-1">
          <button onClick={() => navigate({ search: { tab: "custom" } })}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "custom" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Custom QR Code
          </button>
          <button onClick={() => navigate({ search: { tab: "simple" } })}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "simple" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Simple QR Code
          </button>
          <button onClick={() => navigate({ search: { tab: "ai" } })}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "ai" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            AI QR Code
          </button>
        </div>
      </div>

      {tab === "simple" ? <SimpleTab initialStyle={style} /> : tab === "custom" ? <Suspense fallback={<div className="max-w-6xl mx-auto p-8 text-center text-muted-foreground">Loading...</div>}><CustomQRTab /></Suspense> : <AITab />}
    </div>
  );
}

function SimpleTab({ initialStyle }: { initialStyle?: string }) {
  const [url, setUrl] = useAtom(urlAtom);
  const [selected, setSelected] = useState(initialStyle || "a1");
  const svgRef = useRef<HTMLDivElement>(null);

  const { mod, preset } = findMod(selected);

  const downloadSVG = useCallback(() => {
    const svgEl = svgRef.current?.querySelector("svg");
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const data = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.download = `orator-qr-${selected}.svg`;
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
  }, [selected]);

  const downloadPNG = useCallback(() => {
    const svgEl = svgRef.current?.querySelector("svg");
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const svgData = new XMLSerializer().serializeToString(clone);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = 1200;
      canvas.height = 1200;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1200, 1200);
      ctx.drawImage(img, 0, 0, 1200, 1200);
      const a = document.createElement("a");
      a.download = `orator-qr-${selected}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    const enc = new TextEncoder().encode(svgData);
    let bin = "";
    for (let i = 0; i < enc.length; i++) bin += String.fromCharCode(enc[i]);
    img.src = "data:image/svg+xml;base64," + btoa(bin);
  }, [selected]);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">URL or Text</label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Style</label>
          <div className="grid grid-cols-5 gap-2">
            {styles.map(s => (
              <button key={s.id} onClick={() => s.available && setSelected(s.id)} disabled={!s.available}
                className={`p-2 rounded-lg border text-center text-xs transition-colors ${selected === s.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border hover:border-primary/50"} ${!s.available ? "opacity-40 cursor-not-allowed" : ""}`}>
                <div className="w-full aspect-square bg-muted rounded mb-1 flex items-center justify-center text-[10px] text-muted-foreground font-mono">{s.id.toUpperCase()}</div>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div ref={svgRef} className="w-full max-w-sm aspect-square rounded-xl border bg-white dark:bg-white flex items-center justify-center overflow-hidden">
          {url ? (
            <div key={selected} className="w-[90%] h-[90%] flex items-center justify-center">
              {createElement(mod.renderer, { url, ...(preset || {}) })}
            </div>
          ) : (
            <div className="text-center space-y-2"><div className="text-4xl text-muted-foreground/20">QR</div><p className="text-sm text-muted-foreground">Enter a URL above</p></div>
          )}
        </div>
        {url && (
          <AuthDownloadGate>
            <div className="flex gap-2">
              <button onClick={downloadSVG} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">SVG</button>
              <button onClick={downloadPNG} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">PNG</button>
            </div>
          </AuthDownloadGate>
        )}
      </div>
    </div>
  );
}

function AITab() {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const { generate, generating, resData, error } = useAiGeneration();

  const handleGenerate = () => {
    if (!url || !prompt) return;
    generate({ url, prompt, ...G1Presets.g1 });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">URL or Text</label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">AI Prompt <span className="text-muted-foreground font-normal ml-1">— describe what the QR should look like</span></label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="A starry night sky with swirling galaxies..." rows={3}
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
        </div>
        {error && <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        <button onClick={handleGenerate} disabled={!url || !prompt || generating}
          className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {generating ? "Generating..." : "Generate AI QR Code"}
        </button>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-sm aspect-square rounded-xl border bg-white dark:bg-white flex items-center justify-center overflow-hidden">
          {url && prompt ? <div className="w-[90%] h-[90%]">{qrbtfModuleG1.visualizer({ data: resData })}</div>
            : <div className="text-center space-y-2"><div className="text-4xl text-muted-foreground/20">AI</div><p className="text-sm text-muted-foreground">Enter a URL and prompt</p></div>}
        </div>
        {resData?.status === "completed" && (resData as any).download_url && (
          <a href={(resData as any).download_url} target="_blank" rel="noopener noreferrer"
            className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">Download PNG</a>
        )}
      </div>
    </div>
  );
}
