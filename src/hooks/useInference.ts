
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

const ENV = {
    INFERENCE_URL: process.env.NEXT_PUBLIC_INFERENCE_URL,
    INFERENCE_API_KEY: process.env.NEXT_PUBLIC_INFERENCE_API_KEY
}

const loadImageBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}


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

export default function useInference(file: Blob | null) {
    const [response, setResponse] = useState<Inference | undefined>(undefined)

    useEffect(() => {
        async function loadAndPostImage() {
            const image = await loadImageBase64(file!);

            axios({
                method: "POST",
                url: `${ENV.INFERENCE_URL}?confidence=70`,
                params: {
                    api_key: ENV.INFERENCE_API_KEY
                },
                data: image,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
                .then(function (response) {
                    setResponse(response.data)
                })
                .catch(function (error) {
                    console.log(error.message);
                });

        }

        if (file !== null) {
            setResponse(undefined)
            loadAndPostImage()
        }
    }, [file])

    return response
}