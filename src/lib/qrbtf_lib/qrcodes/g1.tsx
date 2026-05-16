
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { opacityAnimations, transitionMd } from "@/lib/animations";
import { Loader2 } from "lucide-react";
import { QrbtfModule } from "./param";
import { G1Presets } from "./g1_config";
import type { AiImageResponse } from "./hooks/use_ai_generation";

export interface RenderG1OwnProps {
  task_type: string;
  prompt: string;
  negative_prompt: string;
  seed: number;
  control_strength: number;
  prompt_tuning: boolean;
  image_restoration: boolean;
  restoration_rate: number;
  size: string;
  padding_ratio: number;
  correct_level: string;
  anchor_style: string;
}

export type QrbtfRendererG1Props = RenderG1OwnProps;

interface ProgressType {
  value: number;
  status: string;
}

function QrbtfVisualizerG1(props: { data: AiImageResponse | null }) {
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const resp = props.data;
    if (!resp) return;

    switch (resp.status) {
      case "pending":
        setProgress({ value: 0.3, status: "Submitting..." });
        break;
      case "processing":
        setProgress({ value: 0.6, status: "Generating..." });
        break;
      case "completed":
        setProgress({ value: 1, status: "Done" });
        setImageUrl(resp.download_url);
        setProgress(null);
        break;
      case "failed":
        setProgress(null);
        break;
    }
  }, [props.data]);

  return (
    <div className="relative w-full h-full">
      <div className="aspect-square flex flex-col items-center justify-center">
        {!progress && !imageUrl && (
          <div className="text-center space-y-2">
            <div className="text-4xl text-muted-foreground/20">AI</div>
            <p className="text-sm text-muted-foreground">Ready to generate</p>
          </div>
        )}
      </div>

      {(progress || imageUrl) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {progress && (
            <motion.div
              variants={opacityAnimations}
              transition={transitionMd}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-center gap-2"
            >
              <div className="w-2/3 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.value * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                {progress.status}
              </div>
            </motion.div>
          )}

          {!progress && imageUrl && (
            <motion.div
              variants={opacityAnimations}
              transition={transitionMd}
              initial="hidden"
              animate="visible"
              className="w-full h-full"
            >
              <img
                src={imageUrl}
                alt="AI generated QR code"
                className="w-full h-full object-contain"
              />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export const qrbtfModuleG1: QrbtfModule<QrbtfRendererG1Props> = {
  type: "api_fetcher",
  visualizer: QrbtfVisualizerG1,
  presets: G1Presets,
};
