import { useMemo } from "react";
import { QRPointType, encode } from "../encoder";
import { QrbtfRendererPositioningProps } from "./param/position";
import { QrbtfModule, QrbtfRendererCommonProps, RendererProps } from "./param";
import { A3RPresetKeys, A3RPresets } from "./a3r_config";

export interface RenderA3ROwnProps {
  trace_width: number;
  via_size: number;
  via_style: "filled" | "donut" | "target";
  corner_style: "sharp" | "rounded" | "bevel";
  show_grid: boolean;
  trace_color: string;
  via_color: string;
}

export type QrbtfRendererA3RProps = RenderA3ROwnProps &
  QrbtfRendererPositioningProps &
  QrbtfRendererCommonProps;

function QrbtfRendererA3R(props: RendererProps<QrbtfRendererA3RProps>) {
  const [table, typeTable] = useMemo(
    () => encode(props.url, { ecc: props.correct_level }),
    [props.url, props.correct_level],
  );

  const points = useMemo(() => {
    const points: React.ReactNode[] = [];
    const nCount = table.length;
    let id = 0;

    const tw = props.trace_width;
    const vs = props.via_size;
    const tColor = props.trace_color;
    const vColor = props.via_color;

    const ava: boolean[][] = Array.from({ length: nCount }, () =>
      Array(nCount).fill(true),
    );

    for (let y = 0; y < nCount; y++) {
      for (let x = 0; x < nCount; x++) {
        const pt = typeTable[x][y];

        if (pt === QRPointType.POS_CENTER) {
          points.push(
            <rect key={id++} fill={tColor} x={x - 1.5} y={y - 1.5}
              width={3} height={3} rx={props.corner_style === "rounded" ? 0.5 : 0} />,
          );
          points.push(
            <rect key={id++} fill="none" strokeWidth="0.8" stroke={tColor}
              x={x - 3.5} y={y - 3.5} width={7} height={7} rx={0.5} />,
          );
          for (let dx = -3; dx <= 3; dx++) {
            for (let dy = -3; dy <= 3; dy++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < nCount && ny >= 0 && ny < nCount) {
                ava[nx][ny] = false;
              }
            }
          }
        }
      }
    }

    for (let y = 0; y < nCount; y++) {
      for (let x = 0; x < nCount; x++) {
        if (!table[x][y] || !ava[x][y]) continue;

        let hEnd = x;
        while (hEnd < nCount && table[hEnd][y] && ava[hEnd][y]) hEnd++;
        const hLen = hEnd - x;

        if (hLen >= 2) {
          for (let i = x; i < hEnd; i++) ava[i][y] = false;
          const y0 = y + 0.5;
          points.push(
            <line key={id++} stroke={tColor} strokeWidth={tw}
              strokeLinecap={props.corner_style === "rounded" ? "round" : "butt"}
              x1={x + 0.5} y1={y0} x2={hEnd - 0.5} y2={y0} />,
          );
        }
      }
    }

    for (let x = 0; x < nCount; x++) {
      for (let y = 0; y < nCount; y++) {
        if (!table[x][y] || ava[x][y]) continue;

        let vEnd = y;
        while (vEnd < nCount && table[x][vEnd]) vEnd++;
        const vLen = vEnd - y;

        if (vLen >= 2) {
          const x0 = x + 0.5;
          points.push(
            <line key={id++} stroke={tColor} strokeWidth={tw}
              strokeLinecap={props.corner_style === "rounded" ? "round" : "butt"}
              x1={x0} y1={y + 0.5} x2={x0} y2={vEnd - 0.5} />,
          );
        }
      }
    }

    for (let y = 0; y < nCount; y++) {
      for (let x = 0; x < nCount; x++) {
        if (!table[x][y]) continue;
        const hasH = (x + 1 < nCount && table[x + 1][y]) || (x > 0 && table[x - 1][y]);
        const hasV = (y + 1 < nCount && table[x][y + 1]) || (y > 0 && table[x][y - 1]);

        if (hasH && hasV) {
          const cx = x + 0.5;
          const cy = y + 0.5;

          if (props.via_style === "filled") {
            points.push(
              <circle key={id++} fill={vColor} cx={cx} cy={cy} r={vs / 2} />,
            );
          } else if (props.via_style === "donut") {
            points.push(
              <circle key={id++} fill={vColor} cx={cx} cy={cy} r={vs / 2} />,
            );
            points.push(
              <circle key={id++} fill={tColor} cx={cx} cy={cy} r={vs / 4} />,
            );
          } else if (props.via_style === "target") {
            points.push(
              <circle key={id++} fill="none" stroke={vColor} strokeWidth={0.3}
                cx={cx} cy={cy} r={vs / 2} />,
            );
            points.push(
              <circle key={id++} fill="none" stroke={vColor} strokeWidth={0.3}
                cx={cx} cy={cy} r={vs / 3.5} />,
            );
            points.push(
              <circle key={id++} fill={vColor} cx={cx} cy={cy} r={vs / 6} />,
            );
          }
        }
      }
    }

    if (props.show_grid) {
      for (let i = 0; i <= nCount; i++) {
        points.push(
          <line key={id++} stroke={tColor} strokeWidth={0.05} opacity={0.15}
            x1={i} y1={0} x2={i} y2={nCount} />,
        );
        points.push(
          <line key={id++} stroke={tColor} strokeWidth={0.05} opacity={0.15}
            x1={0} y1={i} x2={nCount} y2={i} />,
        );
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

export const qrbtfModuleA3R: QrbtfModule<QrbtfRendererA3RProps, A3RPresetKeys> = {
  type: "svg_renderer",
  presets: A3RPresets,
  renderer: QrbtfRendererA3R,
};
