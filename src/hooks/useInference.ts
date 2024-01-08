
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

export default function useInference(file: Blob | null) {
    const [response, setResponse] = useState<AxiosResponse | undefined>(undefined)

    useEffect(() => {
        async function loadAndPostImage() {
            const image = await loadImageBase64(file!);

            axios({
                method: "POST",
                url: ENV.INFERENCE_URL,
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
            loadAndPostImage()
        }
    }, [file])

    return response
}