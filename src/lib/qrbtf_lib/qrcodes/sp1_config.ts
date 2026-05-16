import { CommonControlProps } from "./param";
import { useCommonParams } from "./param/common";
import { QrbtfRendererSp1Props } from "./sp1";

export type Sp1PresetKeys = "sp1";

export const Sp1Presets: Record<Sp1PresetKeys, QrbtfRendererSp1Props> = {
  sp1: {
    correct_level: "medium",
    content_stroke_width: 0.7,
    content_x_stroke_width: 0.7,
    positioning_stroke_width: 0.9,
    positioning_point_type: "dsj",
  },
};

export function useSp1Params() {
  const { commonParams } = useCommonParams();

  const params: CommonControlProps<QrbtfRendererSp1Props>[] = [
    ...commonParams,
    {
      type: "number",
      name: "content_stroke_width",
      label: "Content Stroke Width",
      desc: "Width of vertical content strokes",
      config: { min: 0, max: 1, step: 0.01 },
    },
    {
      type: "number",
      name: "content_x_stroke_width",
      label: "X-Mark Stroke Width",
      desc: "Width of the X-mark pattern strokes",
      config: { min: 0, max: 1, step: 0.01 },
    },
    {
      type: "number",
      name: "positioning_stroke_width",
      label: "Positioning Stroke Width",
      desc: "Width of positioning marker strokes",
      config: { min: 0, max: 1, step: 0.01 },
    },
    {
      type: "select",
      name: "positioning_point_type",
      label: "Positioning Style",
      desc: "Shape of the positioning markers",
      config: {
        values: [
          { value: "dsj", label: "DSJ" },
          { value: "square", label: "Square" },
        ],
      },
    },
  ];

  return { params };
}
