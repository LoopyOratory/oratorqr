"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { QRCodeJs } from "@qr-platform/qr-code.js";
import { useSession } from "@/auth/client"; 

function makeGradient(on: boolean, c1: string, c2: string, type: string, rot: number) {
  if (!on) return undefined;
  return { type, rotation: rot, colorStops: [{ offset: 0, color: c1 }, { offset: 1, color: c2 }] };
}

const dotTypes = [
  { value: "square", label: "Square" }, { value: "dot", label: "Dot" },
  { value: "rounded", label: "Rounded" }, { value: "extra-rounded", label: "Extra Rnd" },
  { value: "classy", label: "Classy" }, { value: "classy-rounded", label: "Classy Rnd" },
  { value: "vertical-line", label: "V-Line" }, { value: "horizontal-line", label: "H-Line" },
  { value: "star", label: "Star" }, { value: "plus", label: "Plus" },
  { value: "diamond", label: "Diamond" }, { value: "random-dot", label: "Random" },
  { value: "small-square", label: "Small Sq" }, { value: "tiny-square", label: "Tiny Sq" },
];

const cornerTypes = [
  { value: "square", label: "Square" }, { value: "dot", label: "Dot" },
  { value: "rounded", label: "Rounded" }, { value: "classy", label: "Classy" },
  { value: "outpoint", label: "Outpoint" }, { value: "inpoint", label: "Inpoint" },
];

const cornerDotTypes = [
  { value: "square", label: "Square" }, { value: "dot", label: "Dot" },
  { value: "rounded", label: "Rounded" }, { value: "classy", label: "Classy" },
  { value: "heart", label: "Heart" }, { value: "outpoint", label: "Outpoint" },
  { value: "inpoint", label: "Inpoint" },
];

type GradType = "linear" | "radial";

function GradientColor({ color, setColor, gradient, setGradient, color2, setColor2, gradType, setGradType, gradRot, setGradRot, label }: {
  color: string; setColor: (v: string) => void;
  gradient: boolean; setGradient: (v: boolean) => void;
  color2: string; setColor2: (v: string) => void;
  gradType: GradType; setGradType: (v: GradType) => void;
  gradRot: number; setGradRot: (v: number) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <button onClick={() => setGradient(!gradient)}
          className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${gradient ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
          {gradient ? "Gradient" : "Solid"}
        </button>
      </div>
      {gradient ? (
        <div className="space-y-2 p-2 rounded border bg-muted/30">
          <div className="flex gap-2">
            <button onClick={() => setGradType("linear")}
              className={`px-2 py-0.5 rounded text-[10px] border ${gradType === "linear" ? "border-primary bg-primary/10" : "border-border"}`}>Linear</button>
            <button onClick={() => setGradType("radial")}
              className={`px-2 py-0.5 rounded text-[10px] border ${gradType === "radial" ? "border-primary bg-primary/10" : "border-border"}`}>Radial</button>
            {gradType === "linear" && (
              <label className="flex items-center gap-1 ml-auto text-[10px] text-muted-foreground">
                Rot
                <input type="range" min={0} max={360} value={Math.round(gradRot * 180 / Math.PI)} onChange={e => setGradRot(Number(e.target.value) * Math.PI / 180)} className="w-12" />
              </label>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-6 h-6 rounded border cursor-pointer" />
            <span className="text-[10px] text-muted-foreground">→</span>
            <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-6 h-6 rounded border cursor-pointer" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-6 h-6 rounded border cursor-pointer" />
          <span className="text-[10px] font-mono">{color}</span>
        </div>
      )}
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-accent/50 transition-colors rounded-lg">
        {title}
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

export default function CustomQRTab() {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [dotType, setDotType] = useState<string>("square");
  const [cornerSquareType, setCornerSquareType] = useState<string>("square");
  const [cornerDotType, setCornerDotType] = useState<string>("square");
  const [dotColor, setDotColor] = useState("#000000");
  const [dotGradient, setDotGradient] = useState(false);
  const [dotColor2, setDotColor2] = useState("#6366f1");
  const [dotGradType, setDotGradType] = useState<GradType>("linear");
  const [dotGradRot, setDotGradRot] = useState(0);
  const [cornerSquareColor, setCornerSquareColor] = useState("#000000");
  const [cornerGradient, setCornerGradient] = useState(false);
  const [cornerColor2, setCornerColor2] = useState("#6366f1");
  const [cornerGradType, setCornerGradType] = useState<GradType>("linear");
  const [cornerGradRot, setCornerGradRot] = useState(0);
  const [cornerDotColor, setCornerDotColor] = useState("#000000");
  const [cornerDotGradient, setCornerDotGradient] = useState(false);
  const [cornerDotColor2, setCornerDotColor2] = useState("#6366f1");
  const [cornerDotGradType, setCornerDotGradType] = useState<GradType>("linear");
  const [cornerDotGradRot, setCornerDotGradRot] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgGradient, setBgGradient] = useState(false);
  const [bgColor2, setBgColor2] = useState("#e0e7ff");
  const [bgGradType, setBgGradType] = useState<GradType>("linear");
  const [bgGradRot, setBgGradRot] = useState(0);
  const [shape, setShape] = useState<string>("square");
  const [errorLevel, setErrorLevel] = useState<string>("Q");
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<any>(null);

  useEffect(() => {
    if (!url || !containerRef.current) return;
    setError(null);
    containerRef.current.innerHTML = "";
    try {
      const qr = new (QRCodeJs as any)({
        data: url,
        shape: shape,
        dotsOptions: { type: dotType, color: dotGradient ? undefined : dotColor, gradient: makeGradient(dotGradient, dotColor, dotColor2, dotGradType, dotGradRot) },
        cornersSquareOptions: { type: cornerSquareType, color: cornerGradient ? undefined : cornerSquareColor, gradient: makeGradient(cornerGradient, cornerSquareColor, cornerColor2, cornerGradType, cornerGradRot) },
        cornersDotOptions: { type: cornerDotType, color: cornerDotGradient ? undefined : cornerDotColor, gradient: makeGradient(cornerDotGradient, cornerDotColor, cornerDotColor2, cornerDotGradType, cornerDotGradRot) },
        backgroundOptions: { color: bgGradient ? undefined : bgColor, gradient: makeGradient(bgGradient, bgColor, bgColor2, bgGradType, bgGradRot) },
        qrOptions: { errorCorrectionLevel: errorLevel },
        image: logoUrl || undefined,
        imageOptions: logoUrl ? { imageSize: 0.4, margin: 2 } : undefined,
      });
      qr.append(containerRef.current);
      qrRef.current = qr;
    } catch (e: any) {
      setError(e?.message || "Failed to generate QR code");
    }
  }, [url, dotType, cornerSquareType, cornerDotType, dotColor, dotColor2, dotGradient, dotGradType, dotGradRot, cornerSquareColor, cornerColor2, cornerGradient, cornerGradType, cornerGradRot, cornerDotColor, cornerDotColor2, cornerDotGradient, cornerDotGradType, cornerDotGradRot, bgColor, bgColor2, bgGradient, bgGradType, bgGradRot, shape, errorLevel, logoUrl]);

  const downloadSVG = useCallback(async () => {
    try { await qrRef.current?.download?.({ name: "orator-qr-custom", extension: "svg" }); } catch {}
  }, []);

  const downloadPNG = useCallback(async () => {
    try { await qrRef.current?.download?.({ name: "orator-qr-custom", extension: "png" }); } catch {}
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
        <div>
          <label className="text-sm font-medium mb-2 block">URL or Text</label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <CollapsibleSection title="Dot Style" defaultOpen>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Shape</label>
              <div className="grid grid-cols-7 gap-1">
                {dotTypes.map(t => (
                  <button key={t.value} onClick={() => setDotType(t.value)}
                    className={`px-1.5 py-1 rounded text-[10px] border transition-colors ${dotType === t.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>{t.label}</button>
                ))}
              </div>
            </div>
            <GradientColor color={dotColor} setColor={setDotColor} gradient={dotGradient} setGradient={setDotGradient}
              color2={dotColor2} setColor2={setDotColor2} gradType={dotGradType} setGradType={setDotGradType} gradRot={dotGradRot} setGradRot={setDotGradRot} label="Dot Color" />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Corner Squares">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Shape</label>
              <div className="grid grid-cols-6 gap-1">
                {cornerTypes.map(t => (
                  <button key={t.value} onClick={() => setCornerSquareType(t.value)}
                    className={`px-1.5 py-1 rounded text-[10px] border transition-colors ${cornerSquareType === t.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>{t.label}</button>
                ))}
              </div>
            </div>
            <GradientColor color={cornerSquareColor} setColor={setCornerSquareColor} gradient={cornerGradient} setGradient={setCornerGradient}
              color2={cornerColor2} setColor2={setCornerColor2} gradType={cornerGradType} setGradType={setCornerGradType} gradRot={cornerGradRot} setGradRot={setCornerGradRot} label="Corner Color" />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Corner Dots">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Shape</label>
              <div className="grid grid-cols-7 gap-1">
                {cornerDotTypes.map(t => (
                  <button key={t.value} onClick={() => setCornerDotType(t.value)}
                    className={`px-1.5 py-1 rounded text-[10px] border transition-colors ${cornerDotType === t.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>{t.label}</button>
                ))}
              </div>
            </div>
            <GradientColor color={cornerDotColor} setColor={setCornerDotColor} gradient={cornerDotGradient} setGradient={setCornerDotGradient}
              color2={cornerDotColor2} setColor2={setCornerDotColor2} gradType={cornerDotGradType} setGradType={setCornerDotGradType} gradRot={cornerDotGradRot} setGradRot={setCornerDotGradRot} label="Corner Dot Color" />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Appearance">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="text-xs text-muted-foreground">Shape</label>
              <div className="flex gap-1">
                {["square", "circle"].map(s => (
                  <button key={s} onClick={() => setShape(s)}
                    className={`px-3 py-1 rounded text-xs border transition-colors ${shape === s ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Error Correction</label>
              <select value={errorLevel} onChange={e => setErrorLevel(e.target.value)}
                className="rounded border bg-background px-2 py-1 text-xs">
                <option value="L">7% (L)</option>
                <option value="M">15% (M)</option>
                <option value="Q">25% (Q)</option>
                <option value="H">30% (H)</option>
              </select>
            </div>
            <GradientColor color={bgColor} setColor={setBgColor} gradient={bgGradient} setGradient={setBgGradient}
              color2={bgColor2} setColor2={setBgColor2} gradType={bgGradType} setGradType={setBgGradType} gradRot={bgGradRot} setGradRot={setBgGradRot} label="Background" />
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Logo (optional)</label>
              <div className="flex gap-2">
                <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)}
                  placeholder="URL or upload below"
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring" />
                <label className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium hover:bg-accent transition-colors cursor-pointer">
                  Upload
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => setLogoUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }} />
                </label>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div ref={containerRef} className="w-full max-w-sm aspect-square rounded-xl border bg-white flex items-center justify-center overflow-hidden">
          {!url && (
            <div className="text-center space-y-2">
              <div className="text-4xl text-muted-foreground/20">✦</div>
              <p className="text-sm text-muted-foreground">Enter a URL to customize</p>
            </div>
          )}
        </div>
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive w-full max-w-sm text-center">
            {error}
          </div>
        )}
        {url && (
          session?.user ? (
            <div className="flex gap-2">
              <button onClick={downloadSVG} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">SVG</button>
              <button onClick={downloadPNG} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">PNG</button>
            </div>
          ) : (
            <a href="/auth" className="w-full max-w-sm rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-medium hover:bg-primary/90 transition-colors text-center">
              Sign in to Download
            </a>
          )
        )}
      </div>
    </div>
  );
}
