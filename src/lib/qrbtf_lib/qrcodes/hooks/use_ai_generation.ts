"use client";

import { useState, useCallback } from "react";
import { z } from "zod";

const queryResponseSchema = z.union([
  z.object({ task_id: z.string(), status: z.literal("pending"), create_ts: z.number() }),
  z.object({ task_id: z.string(), status: z.literal("processing"), create_ts: z.number() }),
  z.object({ task_id: z.string(), status: z.literal("completed"), create_ts: z.number(), cost: z.number(), download_url: z.string(), nsfw_check: z.boolean(), qr_check: z.boolean() }),
  z.object({ task_id: z.string(), status: z.literal("failed"), create_ts: z.number(), cost: z.number(), error: z.string() }),
]);

export type AiImageResponse = z.infer<typeof queryResponseSchema>;

export function useAiGeneration() {
  const [generating, setGenerating] = useState(false);
  const [resData, setResData] = useState<AiImageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (params: Record<string, any>) => {
    setGenerating(true);
    setError(null);
    setResData(null);

    const apiUrl = import.meta.env.VITE_AI_SERVICE_URL || process.env.NEXT_PUBLIC_AI_SERVICE_URL || "";
    const apiKey = import.meta.env.VITE_AI_SERVICE_API_KEY || process.env.NEXT_PUBLIC_AI_SERVICE_API_KEY || "";

    if (!apiUrl) {
      setGenerating(false);
      setError("AI service not configured. Set VITE_AI_SERVICE_URL in environment.");
      return;
    }

    try {
      const submitRes = await fetch(`${apiUrl}/qrcode/gen_image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify(params),
      });

      if (!submitRes.ok) throw new Error(`Submit error: ${submitRes.status}`);
      const { task_id } = await submitRes.json();

      setResData({ status: "pending", task_id, create_ts: Date.now() });

      const timer = setInterval(async () => {
        try {
          const queryRes = await fetch(`${apiUrl}/qrcode/query_image/${task_id}`, {
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
          });

          if (!queryRes.ok) throw new Error(`Query error: ${queryRes.status}`);
          const result = queryResponseSchema.parse(await queryRes.json());
          setResData(result);

          if (result.status === "completed" || result.status === "failed") {
            setGenerating(false);
            clearInterval(timer);
          }
        } catch {
          setGenerating(false);
          setError("Failed to query generation status");
          clearInterval(timer);
        }
      }, 2000);

      return () => clearInterval(timer);
    } catch {
      setGenerating(false);
      setError("Failed to start generation. Is the AI service running?");
    }
  }, []);

  return { generate, generating, resData, error };
}
