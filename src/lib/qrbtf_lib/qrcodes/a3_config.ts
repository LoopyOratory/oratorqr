import { QrbtfRendererA3Props } from "./a3";
import { CommonControlProps } from "./param";
import { useCommonParams } from "./param/common";
import { usePositioningParams } from "./param/position";

export type A3PresetKeys = "a3";

export const A3Presets: Record<A3PresetKeys, QrbtfRendererA3Props> = {
  a3: {
    correct_level: "medium",
    positioning_point_type: "circle",
    positioning_point_color: "#6366f1",
    vortex_intensity: 60,
    dot_style: "wedge",
    inner_density: "dense",
    color_scheme: "spectrum",
    primary_color: "#6366f1",
    secondary_color: "#ec4899",
  },
};

export function useA3Params() {
  const { commonParams } = useCommonParams();
  const { positioningParams } = usePositioningParams();

  const params: CommonControlProps<QrbtfRendererA3Props>[] = [
    ...commonParams,
    ...positioningParams,
    {
      type: "number",
      name: "vortex_intensity",
      label: "Vortex Intensity",
      desc: "How much spiral rotation to apply. Higher = more twisted",
      config: { min: 0, max: 100, step: 1 },
    },
    {
      type: "select",
      name: "dot_style",
      label: "Dot Style",
      desc: "Shape of individual data points",
      config: {
        values: [
          { value: "pixel", label: "Pixel" },
          { value: "wedge", label: "Wedge" },
          { value: "droplet", label: "Droplet" },
        ],
      },
    },
    {
      type: "select",
      name: "inner_density",
      label: "Density",
      desc: "Size and spacing of data points",
      config: {
        values: [
          { value: "dense", label: "Dense" },
          { value: "sparse", label: "Sparse" },
        ],
      },
    },
    {
      type: "select",
      name: "color_scheme",
      label: "Color Scheme",
      desc: "How color is applied across the vortex",
      config: {
        values: [
          { value: "monochrome", label: "Monochrome" },
          { value: "gradient", label: "Gradient" },
          { value: "spectrum", label: "Spectrum" },
        ],
      },
    },
    {
      type: "color",
      name: "primary_color",
      label: "Primary Color",
      desc: "Main color (monochrome) or start color (gradient)",
      config: {},
    },
    {
      type: "color",
      name: "secondary_color",
      label: "Secondary Color",
      desc: "End color for gradient mode",
      config: {},
    },
  ];

  return { params };
}
