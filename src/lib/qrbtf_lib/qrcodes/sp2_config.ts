import { QrbtfRendererSp2Props } from "./sp2";
import { CommonControlProps } from "./param";
import { useCommonParams } from "./param/common";
import { usePositioningParams } from "./param/position";

export type Sp2PresetKeys = "sp2";

export const Sp2Presets: Record<Sp2PresetKeys, QrbtfRendererSp2Props> = {
  sp2: {
    correct_level: "medium",
    positioning_point_type: "square",
    positioning_point_color: "#0f172a",
    tile_size: 4,
    irregularity: 30,
    tile_shape: "rounded",
    grout_width: 0.25,
    grout_color: "#f1f5f9",
    palette: "cool",
  },
};

export function useSp2Params() {
  const { commonParams } = useCommonParams();
  const { positioningParams } = usePositioningParams();

  const params: CommonControlProps<QrbtfRendererSp2Props>[] = [
    ...commonParams,
    ...positioningParams,
    {
      type: "number",
      name: "tile_size",
      label: "Tile Size",
      desc: "Maximum size of mosaic tiles. Larger = fewer, bigger tiles",
      config: { min: 2, max: 8, step: 1 },
    },
    {
      type: "number",
      name: "irregularity",
      label: "Irregularity",
      desc: "How much the tile edges deviate from perfect alignment",
      config: { min: 0, max: 100, step: 1 },
    },
    {
      type: "select",
      name: "tile_shape",
      label: "Tile Shape",
      desc: "Shape of individual mosaic tiles",
      config: {
        values: [
          { value: "square", label: "Square" },
          { value: "rounded", label: "Rounded" },
          { value: "hexagon", label: "Hexagon" },
        ],
      },
    },
    {
      type: "number",
      name: "grout_width",
      label: "Grout Width",
      desc: "Gap between tiles (like grout in mosaic)",
      config: { min: 0, max: 1, step: 0.05 },
    },
    {
      type: "color",
      name: "grout_color",
      label: "Grout Color",
      desc: "Color of the gaps between tiles",
      config: {},
    },
    {
      type: "select",
      name: "palette",
      label: "Color Palette",
      desc: "Color scheme for the mosaic tiles",
      config: {
        values: [
          { value: "contrast", label: "High Contrast" },
          { value: "warm", label: "Warm" },
          { value: "cool", label: "Cool" },
          { value: "neon", label: "Neon" },
        ],
      },
    },
  ];

  return { params };
}
