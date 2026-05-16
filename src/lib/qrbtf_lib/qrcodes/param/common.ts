import { CommonControlProps, QrbtfRendererCommonProps } from ".";

type CommonParamsType = CommonControlProps<QrbtfRendererCommonProps>;

export function useCommonParams() {
  const commonParams: CommonParamsType[] = [
    {
      type: "select",
      name: "correct_level",
      label: "Error Correction",
      desc: "Higher levels make the QR code more resistant to damage but increase density",
      config: {
        values: [
          { value: "low", label: "7%" },
          { value: "medium", label: "15%" },
          { value: "quartile", label: "25%" },
          { value: "high", label: "30%" },
        ],
      },
    },
  ];
  return { commonParams };
}
