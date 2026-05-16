import { QrbtfRendererA1Props } from "./a1";
import { CommonControlProps } from "./param";
import { useCommonParams } from "./param/common";
import { usePositioningParams } from "./param/position";

export type A1PresetKeys = "a1" | "a1c" | "a1p";

export const A1Presets: Record<A1PresetKeys, QrbtfRendererA1Props> = {
  a1: {
    correct_level: "medium",
    positioning_point_type: "square",
    positioning_point_color: "#000000",
    content_point_type: "square",
    content_point_scale: 1,
    content_point_opacity: 1,
    content_point_color: "#000000",
  },
  a1c: {
    correct_level: "medium",
    content_point_type: "circle",
    positioning_point_type: "circle",
    positioning_point_color: "#000000",
    content_point_scale: 0.5,
    content_point_opacity: 0.3,
    content_point_color: "#000000",
  },
  a1p: {
    correct_level: "medium",
    content_point_type: "circle",
    positioning_point_type: "planet",
    positioning_point_color: "#000000",
    content_point_scale: 0.0,
    content_point_opacity: 1,
    content_point_color: "#000000",
  },
};

export function useA1Params() {
  const { commonParams } = useCommonParams();
  const { positioningParams } = usePositioningParams();

  const params: CommonControlProps<QrbtfRendererA1Props>[] = [
    ...commonParams,
    ...positioningParams,
    {
      type: "select",
      name: "content_point_type",
      label: "Point Shape",
      desc: "Shape of individual QR data cells",
      config: {
        values: [
          { value: "square", label: "Square" },
          { value: "circle", label: "Circle" },
        ],
      },
    },
    {
      type: "number",
      name: "content_point_scale",
      label: "Point Size",
      desc: "Size of data points relative to cell size",
      config: { min: 0, max: 1, step: 0.01 },
    },
    {
      type: "number",
      name: "content_point_opacity",
      label: "Point Opacity",
      desc: "Transparency of data points",
      config: { min: 0, max: 1, step: 0.01 },
    },
    {
      type: "color",
      name: "content_point_color",
      label: "Point Color",
      desc: "Color of data cells",
      config: {},
    },
  ];

  return { params };
}
