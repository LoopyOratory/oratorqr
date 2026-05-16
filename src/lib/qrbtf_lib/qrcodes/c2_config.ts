import { QrbtfRendererC2Props } from "./c2";
import { CommonControlProps } from "./param";
import { useCommonParams } from "./param/common";

export type C2PresetKeys = "c2";

export const C2Presets: Record<C2PresetKeys, QrbtfRendererC2Props> = {
  c2: {
    correct_level: "high",
    brightness: 0,
    contrast: 0,
    background: "/assets/images/c2_background.jpg",
    align_type: "none",
    timing_type: "none",
  },
};

export function useC2Params() {
  const { commonParams } = useCommonParams();

  const params: CommonControlProps<QrbtfRendererC2Props>[] = [
    ...commonParams,
    {
      type: "number",
      name: "contrast",
      label: "Contrast",
      desc: "Adjust contrast of the background image",
      config: { min: -1, max: 1, step: 0.01 },
    },
    {
      type: "number",
      name: "brightness",
      label: "Brightness",
      desc: "Adjust brightness of the background image",
      config: { min: -1, max: 1, step: 0.01 },
    },
    {
      type: "image",
      name: "background",
      label: "Background Image",
      desc: "Upload an image to embed in the QR code",
      config: { buttonLabel: "Choose Image" },
    },
    {
      type: "select",
      name: "align_type",
      label: "Alignment Pattern",
      desc: "How alignment patterns are rendered",
      config: {
        values: [
          { label: "None", value: "none" },
          { label: "Black & White", value: "black-white" },
        ],
      },
    },
    {
      type: "select",
      name: "timing_type",
      label: "Timing Pattern",
      desc: "How timing patterns are rendered",
      config: {
        values: [
          { label: "None", value: "none" },
          { label: "Black & White", value: "black-white" },
        ],
      },
    },
  ];

  return { params };
}
