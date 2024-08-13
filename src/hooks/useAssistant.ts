import OpenAI from "openai";
import { useEffect, useState } from "react";
import useProducts from "./useProducts";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const useAssistant = (data?: string) => {
  const [insight, setInsight] = useState<null | string>();
  const products = useProducts();

  useEffect(() => {
    async function doWork() {
      if (data === null) {
        return;
      }

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You provide insights and trend analysis for an on-shelf program. You are given a JSON object to interpret. Keep your insights short as there will be visualisations accompanying your answers displayed underneath. Make sure not to mention any technical jargons as this will be for non-technical people.",
          },
          {
            role: "system",
            content: `This is the full inventory list: ${products
              .map((p) => p.description)
              .join(",")} `,
          },
          {
            role: "system",
            content:
              "You should not answer any questions unrelated to your role at providing insights and trend analysis on the data.",
          },
          {
            role: "user",
            content: `Given the JSON ${data} What products are missing?`,
          },
        ],
        model: "gpt-4o-mini",
      });
      setInsight(completion.choices[0].message.content);
    }

    doWork();
  }, [data]);

  return { insight };
};
