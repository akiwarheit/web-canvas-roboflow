import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";

const ENV = {
  INFERENCE_URL: process.env.NEXT_PUBLIC_INFERENCE_URL,
  INFERENCE_API_KEY: process.env.NEXT_PUBLIC_INFERENCE_API_KEY,
};

const loadImageBase64 = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
}

interface Image {
  width: number;
  height: number;
}

export interface Inference {
  time: number;
  image: Image;
  predictions: Prediction[];
}

export default function useInference(file: Blob | null, confidence = 80) {
  const [response, setResponse] = useState<Inference | undefined>(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadAndPostImage = useCallback(
    debounce(async (file, confidence) => {
      const image = await loadImageBase64(file);

      axios({
        method: "POST",
        url: `${ENV.INFERENCE_URL}?confidence=${confidence}`,
        params: {
          api_key: ENV.INFERENCE_API_KEY,
        },
        data: image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          setResponse(response.data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }, 3000),
    [file, confidence]
  );

  useEffect(() => {
    if (file !== null) {
      setResponse(undefined);
      loadAndPostImage(file, confidence);
    }
  }, [confidence, file, loadAndPostImage]);

  return response;
}
