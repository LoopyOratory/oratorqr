import { useMemo } from "react";
import { QRPointType, encode } from "../encoder";
import { sq25 } from "@/lib/qrbtf_lib/constants";
import { QrbtfRendererPositioningProps } from "./param/position";
import { QrbtfModule, QrbtfRendererCommonProps, RendererProps } from "./param";
import { A3PresetKeys, A3Presets } from "./a3_config";

export interface RenderA3OwnProps {
  vortex_intensity: number;
  dot_style: "pixel" | "wedge" | "droplet";
  inner_density: "sparse" | "dense";
  color_scheme: "monochrome" | "gradient" | "spectrum";
  primary_color: string;
  secondary_color: string;
}

export type QrbtfRendererA3Props = RenderA3OwnProps &
  QrbtfRendererPositioningProps &
  QrbtfRendererCommonProps;

function getColor(t: number, scheme: string, c1: string, c2: string): string {
  if (scheme === "monochrome") return c1;
  if (scheme === "gradient") {
    const r1 = parseInt(c1.slice(1, 3), 16);
    const g1 = parseInt(c1.slice(3, 5), 16);
    const b1 = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16);
    const g2 = parseInt(c2.slice(3, 5), 16);
    const b2 = parseInt(c2.slice(5, 7), 16);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  if (scheme === "spectrum") {
    const h = t * 360;
    const s = 70;
    const l = 50;
    const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l / 100 - c / 2;
    let rp = 0, gp = 0, bp = 0;
    if (h < 60) { rp = c; gp = x; }
    else if (h < 120) { rp = x; gp = c; }
    else if (h < 180) { gp = c; bp = x; }
    else if (h < 240) { gp = x; bp = c; }
    else if (h < 300) { rp = x; bp = c; }
    else { rp = c; bp = x; }
    const r = Math.round((rp + m) * 255);
    const g = Math.round((gp + m) * 255);
    const b = Math.round((bp + m) * 255);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  return c1;
}

function QrbtfRendererA3(props: RendererProps<QrbtfRendererA3Props>) {
  const [table, typeTable] = useMemo(
    () => encode(props.url, { ecc: props.correct_level }),
    [props.url, props.correct_level],
  );

  const points = useMemo(() => {
    const points: React.ReactNode[] = [];
    const nCount = table.length;
    const cx = (nCount - 1) / 2;
    const cy = (nCount - 1) / 2;
    const maxR = Math.sqrt(cx * cx + cy * cy);
    let id = 0;

    for (let y = 0; y < nCount; y++) {
      for (let x = 0; x < nCount; x++) {
        if (!table[x][y]) continue;
        const pt = typeTable[x][y];

        if (pt === QRPointType.POS_CENTER || pt === QRPointType.POS_OTHER) {
          if (pt === QRPointType.POS_CENTER) {
            points.push(
              <circle key={id++} fill={props.positioning_point_color}
                cx={x + 0.5} cy={y + 0.5} r={1.5} />,
            );
            points.push(
              <circle key={id++} fill="none" strokeWidth="0.8"
                stroke={props.positioning_point_color}
                cx={x + 0.5} cy={y + 0.5} r={3} />,
            );
          }
          continue;
        }

        if (pt === QRPointType.ALIGN_CENTER || pt === QRPointType.ALIGN_OTHER ||
            pt === QRPointType.TIMING || pt === QRPointType.FORMAT || pt === QRPointType.VERSION) {
          const dx = x - cx;
          const dy = y - cy;
          const r = Math.sqrt(dx * dx + dy * dy);
          let angle = Math.atan2(dy, dx);
          const intensity = props.vortex_intensity / 100;
          angle += r * intensity * 0.5;

          const rx = cx + r * Math.cos(angle);
          const ry = cy + r * Math.sin(angle);

          const t = r / maxR;
          const color = getColor(t, props.color_scheme, props.primary_color, props.secondary_color);
          const size = props.inner_density === "dense" ? 0.65 : 0.4;

          if (props.dot_style === "pixel") {
            points.push(
              <rect key={id++} fill={color}
                x={rx + 0.5 - size / 2} y={ry + 0.5 - size / 2}
                width={size} height={size} rx={size * 0.2} />,
            );
          } else if (props.dot_style === "wedge") {
            const wSize = size * 0.7;
            const sAngle = angle - Math.PI / 8;
            const eAngle = angle + Math.PI / 8;
            const x1 = rx + 0.5 + wSize * Math.cos(sAngle);
            const y1 = ry + 0.5 + wSize * Math.sin(sAngle);
            const x2 = rx + 0.5 + wSize * Math.cos(eAngle);
            const y2 = ry + 0.5 + wSize * Math.sin(eAngle);
            points.push(
              <path key={id++} fill={color}
                d={`M${rx + 0.5 + 0.15 * Math.cos(angle)} ${ry + 0.5 + 0.15 * Math.sin(angle)} L${x1} ${y1} A${wSize} ${wSize} 0 0 1 ${x2} ${y2} Z`} />,
            );
          } else if (props.dot_style === "droplet") {
            points.push(
              <circle key={id++} fill={color} opacity={0.85}
                cx={rx + 0.5} cy={ry + 0.5} r={size * 0.6} />,
            );
            const gradId = `grad_${id++}`;
            points.push(
              <defs key={`def_${id}`}>
                <radialGradient id={gradId} cx="50%" cy="30%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
              </defs>,
            );
            points.push(
              <circle key={id++} fill={`url(#${gradId})`}
                cx={rx + 0.5} cy={ry + 0.5} r={size * 0.6} />,
            );
          }
        } else {
          const dx = x - cx;
          const dy = y - cy;
          const r = Math.sqrt(dx * dx + dy * dy);
          let angle = Math.atan2(dy, dx);
          const intensity = props.vortex_intensity / 100;
          angle += r * intensity * 0.5;

          const rx = cx + r * Math.cos(angle);
          const ry = cy + r * Math.sin(angle);

          const t = r / maxR;
          const color = getColor(t, props.color_scheme, props.primary_color, props.secondary_color);
          const size = props.inner_density === "dense" ? 0.6 : 0.35;

          if (props.dot_style === "pixel") {
            points.push(
              <rect key={id++} fill={color} opacity={0.9}
                x={rx + 0.5 - size / 2} y={ry + 0.5 - size / 2}
                width={size} height={size} rx={size * 0.15} />,
            );
          } else if (props.dot_style === "wedge") {
            const wSize = size * 0.6;
            const sAngle = angle - Math.PI / 6;
            const eAngle = angle + Math.PI / 6;
            const x1 = rx + 0.5 + wSize * Math.cos(sAngle);
            const y1 = ry + 0.5 + wSize * Math.sin(sAngle);
            const x2 = rx + 0.5 + wSize * Math.cos(eAngle);
            const y2 = ry + 0.5 + wSize * Math.sin(eAngle);
            points.push(
              <path key={id++} fill={color} opacity={0.85}
                d={`M${rx + 0.5} ${ry + 0.5} L${x1} ${y1} A${wSize} ${wSize} 0 0 1 ${x2} ${y2} Z`} />,
            );
          } else if (props.dot_style === "droplet") {
            points.push(
              <circle key={id++} fill={color} opacity={0.8}
                cx={rx + 0.5} cy={ry + 0.5} r={size * 0.5} />,
            );
          }
        }
      }
    }
    return points;
  }, [table, typeTable, props]);

  const viewBox = `${-table.length / 5} ${-table.length / 5} ${(7 * table.length) / 5} ${(7 * table.length) / 5}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} {...props}>
      {points}
    </svg>
  );
}

export const qrbtfModuleA3: QrbtfModule<QrbtfRendererA3Props, A3PresetKeys> = {
  type: "svg_renderer",
  presets: A3Presets,
  renderer: QrbtfRendererA3,
};
