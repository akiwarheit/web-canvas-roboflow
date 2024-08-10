import OpenAI from "openai";
import { useEffect, useState } from "react";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const useAssistant = (data?: string) => {
  const [insight, setInsight] = useState<null | string>();

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
            role: "user",
            content: `Given the JSON ${data} What products are missing?`,
          },
        ],
        model: "gpt-4o-mini",
      });
      console.log(completion.choices[0].message.content);
      setInsight(completion.choices[0].message.content);
    }

    doWork();
  }, [data]);

  return { insight };
};