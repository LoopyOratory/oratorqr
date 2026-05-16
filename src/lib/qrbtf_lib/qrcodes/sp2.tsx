import { useMemo } from "react";
import { QRPointType, encode } from "../encoder";
import { sq25 } from "@/lib/qrbtf_lib/constants";
import { QrbtfRendererPositioningProps } from "./param/position";
import { QrbtfModule, QrbtfRendererCommonProps, RendererProps } from "./param";
import { Sp2PresetKeys, Sp2Presets } from "./sp2_config";
import { rand } from "@/lib/utils";

export interface RenderSp2OwnProps {
  tile_size: number;
  irregularity: number;
  tile_shape: "square" | "rounded" | "hexagon";
  grout_width: number;
  grout_color: string;
  palette: "contrast" | "warm" | "cool" | "neon";
}

export type QrbtfRendererSp2Props = RenderSp2OwnProps &
  QrbtfRendererPositioningProps &
  QrbtfRendererCommonProps;

function getPaletteColor(t: number, palette: string): string {
  if (palette === "contrast") {
    return t > 0.5 ? "#1a1a2e" : "#e94560";
  }
  if (palette === "warm") {
    const c = [
      "#f97316", "#ef4444", "#eab308", "#f59e0b", "#dc2626",
    ];
    return c[Math.floor(t * c.length) % c.length];
  }
  if (palette === "cool") {
    const c = [
      "#3b82f6", "#6366f1", "#06b6d4", "#8b5cf6", "#0ea5e9",
    ];
    return c[Math.floor(t * c.length) % c.length];
  }
  if (palette === "neon") {
    const c = [
      "#ff00ff", "#00ffff", "#ff6600", "#00ff66", "#ffff00", "#ff0066",
    ];
    return c[Math.floor(t * c.length) % c.length];
  }
  return "#000000";
}

function simpleNoise(x: number, y: number, seed: number): number {
  let n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function QrbtfRendererSp2(props: RendererProps<QrbtfRendererSp2Props>) {
  const [table, typeTable] = useMemo(
    () => encode(props.url, { ecc: props.correct_level }),
    [props.url, props.correct_level],
  );

  const points = useMemo(() => {
    const points: React.ReactNode[] = [];
    const nCount = table.length;
    let id = 0;
    const ts = Math.max(2, Math.round(props.tile_size));
    const gw = props.grout_width;
    const irr = props.irregularity / 100;

    const merged: (number | null)[][] = Array.from({ length: nCount }, () =>
      Array(nCount).fill(null),
    );

    for (let y = 0; y < nCount; y++) {
      for (let x = 0; x < nCount; x++) {
        if (merged[x][y] !== null) continue;
        if (!table[x][y]) continue;

        const pt = typeTable[x][y];
        if (pt === QRPointType.POS_CENTER || pt === QRPointType.POS_OTHER) continue;
        if (pt === QRPointType.ALIGN_CENTER || pt === QRPointType.ALIGN_OTHER) continue;
        if (pt === QRPointType.TIMING) continue;

        let ex = x;
        let ey = y;
        while (ex < nCount - 1 && table[ex + 1][y] && typeTable[ex + 1][y] === QRPointType.DATA && merged[ex + 1][y] === null) ex++;
        while (ey < nCount - 1 && table[x][ey + 1] && typeTable[x][ey + 1] === QRPointType.DATA && merged[x][ey + 1] === null) ey++;

        ex = Math.min(ex, x + ts - 1);
        ey = Math.min(ey, y + ts - 1);

        const tileId = id++;
        for (let dx = x; dx <= ex; dx++) {
          for (let dy = y; dy <= ey; dy++) {
            if (table[dx][dy]) {
              merged[dx][dy] = tileId;
            }
          }
        }

        const rx = x + 0.5;
        const ry = y + 0.5;
        const rw = ex - x + 1 - gw;
        const rh = ey - y + 1 - gw;

        const noiseX = (simpleNoise(x, y, 42) - 0.5) * irr * 2;
        const noiseY = (simpleNoise(x + 100, y + 100, 42) - 0.5) * irr * 2;
        const noiseW = (simpleNoise(x, y, 99) - 0.5) * irr * 1.5;
        const noiseH = (simpleNoise(x + 200, y + 200, 99) - 0.5) * irr * 1.5;

        const t = (x + y) / (nCount * 2);
        const color = getPaletteColor(t, props.palette);

        if (props.tile_shape === "hexagon") {
          const cx = rx + rw / 2 + noiseX;
          const cy = ry + rh / 2 + noiseY;
          const hw = (rw + noiseW) / 2;
          const hh = (rh + noiseH) / 2;
          points.push(
            <polygon key={tileId} fill={color}
              points={`${cx - hw * 0.75},${cy} ${cx - hw * 0.25},${cy - hh} ${cx + hw * 0.25},${cy - hh} ${cx + hw * 0.75},${cy} ${cx + hw * 0.25},${cy + hh} ${cx - hw * 0.25},${cy + hh}`}
            />,
          );
        } else {
          const borderRadius = props.tile_shape === "rounded"
            ? Math.min(rw, rh) * 0.3
            : 0;

          points.push(
            <rect key={tileId} fill={color}
              x={rx + noiseX} y={ry + noiseY}
              width={Math.max(0.1, rw + noiseW)}
              height={Math.max(0.1, rh + noiseH)}
              rx={borderRadius} />,
          );
        }
      }
    }

    for (let y = 0; y < nCount; y++) {
      for (let x = 0; x < nCount; x++) {
        const pt = typeTable[x][y];
        if (pt === QRPointType.POS_CENTER) {
          points.push(
            <rect key={`pos_${x}_${y}`} fill={props.positioning_point_color}
              x={x - 1.5} y={y - 1.5} width={3} height={3} rx={0.3} />,
          );
          points.push(
            <rect key={`posb_${x}_${y}`} fill="none" strokeWidth="1"
              stroke={props.positioning_point_color}
              x={x - 3.5} y={y - 3.5} width={7} height={7} rx={0.5} />,
          );
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

export const qrbtfModuleSp2: QrbtfModule<QrbtfRendererSp2Props, Sp2PresetKeys> = {
  type: "svg_renderer",
  presets: Sp2Presets,
  renderer: QrbtfRendererSp2,
};
