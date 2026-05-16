import { QrbtfRendererG1Props } from "./g1";
import { CommonControlProps } from "./param";

export type G1PresetKeys = "g1";

export const G1Presets: Record<G1PresetKeys, QrbtfRendererG1Props> = {
  g1: {
    task_type: "qrcode",
    prompt: "",
    negative_prompt: "",
    seed: -1,
    control_strength: 1.15,
    prompt_tuning: true,
    image_restoration: false,
    restoration_rate: 0.5,
    size: "1152",
    padding_ratio: 0.2,
    correct_level: "15",
    anchor_style: "square",
  },
};

export function useG1Params() {
  const params: CommonControlProps<QrbtfRendererG1Props>[] = [
    {
      type: "prompt",
      name: "prompt",
      label: "Prompt",
      desc: "Describe what the QR code should look like. Be specific.",
      config: {
        placeholder: "A starry night sky with swirling galaxies and glowing stars...",
      },
    },
    {
      type: "text",
      name: "negative_prompt",
      label: "Negative Prompt",
      desc: "Elements to avoid in the generated image",
      config: {
        placeholder: "blurry, low quality, text, watermark...",
      },
    },
    {
      type: "number",
      name: "seed",
      label: "Seed",
      desc: "Random seed. -1 for random each time, specific number for reproducible results",
      config: { min: -1, max: 9999 },
    },
    {
      type: "number",
      name: "control_strength",
      label: "Control Strength",
      desc: "How strongly the QR pattern is enforced. Higher = more scannable but less artistic",
      config: { min: 0.5, max: 1.5, step: 0.01 },
    },
    {
      type: "boolean",
      name: "image_restoration",
      label: "Image Restoration",
      desc: "Post-process to enhance image quality",
      config: { status: "Restoration" },
    },
    {
      type: "number",
      name: "restoration_rate",
      label: "Restoration Rate",
      desc: "Strength of image restoration post-processing",
      config: { min: 0.0, max: 0.5, step: 0.01 },
    },
    {
      type: "select",
      name: "size",
      label: "Output Size",
      desc: "Resolution of the generated QR code image",
      config: {
        values: [
          { value: "1152", label: "1152px" },
          { value: "1536", label: "1536px" },
        ],
      },
    },
    {
      type: "number",
      name: "padding_ratio",
      label: "Padding",
      desc: "How much padding around the QR code",
      config: { min: 0.0, max: 0.5, step: 0.01 },
    },
    {
      type: "select",
      name: "correct_level",
      label: "Error Correction",
      desc: "Error correction level. Higher = more resistant to damage",
      config: {
        values: [
          { value: "7", label: "7%" },
          { value: "15", label: "15%" },
          { value: "25", label: "25%" },
          { value: "30", label: "30%" },
        ],
      },
    },
    {
      type: "select",
      name: "anchor_style",
      label: "Anchor Style",
      desc: "Style of the QR corner anchors",
      config: {
        values: [
          { value: "square", label: "Square" },
          { value: "circle", label: "Circle" },
          { value: "minimal", label: "Minimal" },
        ],
      },
    },
  ];

  return { params };
}
