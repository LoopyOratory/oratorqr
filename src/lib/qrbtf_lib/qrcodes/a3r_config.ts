import { QrbtfRendererA3RProps } from "./a3r";
import { CommonControlProps } from "./param";
import { useCommonParams } from "./param/common";
import { usePositioningParams } from "./param/position";

export type A3RPresetKeys = "a3r";

export const A3RPresets: Record<A3RPresetKeys, QrbtfRendererA3RProps> = {
  a3r: {
    correct_level: "medium",
    positioning_point_type: "square",
    positioning_point_color: "#22c55e",
    trace_width: 0.4,
    via_size: 1.2,
    via_style: "target",
    corner_style: "rounded",
    show_grid: true,
    trace_color: "#22c55e",
    via_color: "#86efac",
  },
};

export function useA3RParams() {
  const { commonParams } = useCommonParams();
  const { positioningParams } = usePositioningParams();

  const params: CommonControlProps<QrbtfRendererA3RProps>[] = [
    ...commonParams,
    ...positioningParams,
    {
      type: "number",
      name: "trace_width",
      label: "Trace Width",
      desc: "Width of circuit traces connecting data points",
      config: { min: 0.1, max: 1.5, step: 0.05 },
    },
    {
      type: "number",
      name: "via_size",
      label: "Via Size",
      desc: "Size of circular vias at trace intersections",
      config: { min: 0.5, max: 3, step: 0.1 },
    },
    {
      type: "select",
      name: "via_style",
      label: "Via Style",
      desc: "Appearance of connection vias",
      config: {
        values: [
          { value: "filled", label: "Filled" },
          { value: "donut", label: "Donut" },
          { value: "target", label: "Target" },
        ],
      },
    },
    {
      type: "select",
      name: "corner_style",
      label: "Corner Style",
      desc: "How trace corners are rendered",
      config: {
        values: [
          { value: "sharp", label: "Sharp" },
          { value: "rounded", label: "Rounded" },
          { value: "bevel", label: "Bevel" },
        ],
      },
    },
    {
      type: "boolean",
      name: "show_grid",
      label: "Alignment Grid",
      desc: "Show subtle background grid",
      config: { status: "Show Grid" },
    },
    {
      type: "color",
      name: "trace_color",
      label: "Trace Color",
      desc: "Color of circuit traces",
      config: {},
    },
    {
      type: "color",
      name: "via_color",
      label: "Via Color",
      desc: "Color of connection vias",
      config: {},
    },
  ];

  return { params };
}
