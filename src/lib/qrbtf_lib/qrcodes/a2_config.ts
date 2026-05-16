import { QrbtfRendererA2Props } from "./a2";
import { CommonControlProps } from "./param";
import { useCommonParams } from "./param/common";
import { usePositioningParams } from "./param/position";

export type A2PresetKeys = "a2" | "a2c";

export const A2Presets: Record<A2PresetKeys, QrbtfRendererA2Props> = {
  a2: {
    correct_level: "medium",
    positioning_point_type: "rounded",
    positioning_point_color: "#000000",
    content_line_type: "interlock",
    content_point_scale: 0.6,
    content_point_opacity: 1,
    content_point_color: "#000000",
  },
  a2c: {
    correct_level: "medium",
    content_line_type: "cross",
    positioning_point_type: "square",
    positioning_point_color: "#000000",
    content_point_scale: 0.6,
    content_point_opacity: 1,
    content_point_color: "#000000",
  },
};

export function useA2Params() {
  const { commonParams } = useCommonParams();
  const { positioningParams } = usePositioningParams();

  const params: CommonControlProps<QrbtfRendererA2Props>[] = [
    ...commonParams,
    ...positioningParams,
    {
      type: "select",
      name: "content_line_type",
      label: "Line Pattern",
      desc: "How data cells connect to form the QR pattern",
      config: {
        values: [
          { value: "horizontal", label: "Horizontal" },
          { value: "vertical", label: "Vertical" },
          { value: "interlock", label: "Interlock" },
          { value: "radial", label: "Radial" },
          { value: "tl-br", label: "Diagonal ↘" },
          { value: "tr-bl", label: "Diagonal ↙" },
          { value: "cross", label: "Cross" },
        ],
      },
    },
    {
      type: "number",
      name: "content_point_scale",
      label: "Line Thickness",
      desc: "Width of the connecting lines",
      config: { min: 0, max: 1, step: 0.01 },
    },
    {
      type: "number",
      name: "content_point_opacity",
      label: "Opacity",
      desc: "Transparency of the QR pattern",
      config: { min: 0, max: 1, step: 0.01 },
    },
    {
      type: "color",
      name: "content_point_color",
      label: "Color",
      desc: "Color of the QR pattern",
      config: {},
    },
  ];

  return { params };
}
