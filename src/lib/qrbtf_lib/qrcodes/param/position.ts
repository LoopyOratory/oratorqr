import { CommonControlProps } from ".";

export interface QrbtfRendererPositioningProps {
  positioning_point_type: "square" | "circle" | "planet" | "rounded";
  positioning_point_color: string;
}

type PositioningParamsType = CommonControlProps<QrbtfRendererPositioningProps>;

export function usePositioningParams() {
  const positioningParams: PositioningParamsType[] = [
    {
      type: "select",
      name: "positioning_point_type",
      label: "Positioning Pattern",
      desc: "Shape of the three corner positioning markers",
      config: {
        values: [
          { value: "square", label: "Square" },
          { value: "circle", label: "Circle" },
          { value: "planet", label: "Planet" },
          { value: "rounded", label: "Rounded" },
        ],
      },
    },
    {
      type: "color",
      name: "positioning_point_color",
      label: "Positioning Color",
      desc: "Color of the positioning markers",
      config: {},
    },
  ];
  return { positioningParams };
}
