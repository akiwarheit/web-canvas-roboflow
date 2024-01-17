"use client";
import { Inference } from '@/hooks/useInference';
import React from 'react';


import { useEffect, useRef } from 'react';

const BoundingBoxes = ({ responseData, image }: { responseData: Inference, image: any }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas !== null) {

            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Scaling it down to the Card height so it doesn't blow up the dashboard
                    const parentWidth = canvas.parentElement?.clientWidth || 0;
                    const scaleFactor = parentWidth / img.width;
                    const newWidth = img.width * scaleFactor;
                    const newHeight = img.height * scaleFactor;

                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    responseData.predictions.forEach((prediction: any) => {
                        const { x, y, width, height, class: clazz } = prediction;
                        // @TODO - fix this - i'm not sure why we need to scale it down to .9
                        const scaledWidth = width * (scaleFactor);
                        const scaledHeight = height * (scaleFactor);

                        const scaledX = (x * (scaleFactor) - (scaledWidth / 2));
                        const scaledY = (y * (scaleFactor) - (scaledHeight / 2));

                        ctx.strokeStyle = "#FF0000";
                        ctx.lineWidth = 1;
                        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

                        // ctx.strokeStyle = "#FFFFFF";
                        // ctx.lineWidth = 1;
                        // ctx.strokeText(clazz, scaledX - 5, scaledY);

                        ctx.font = '14px Sans-serif';
                        ctx.strokeStyle = 'green';
                        ctx.lineWidth = 2;
                        ctx.strokeText(clazz, scaledX - 5, scaledY);
                        ctx.fillStyle = 'black';
                        ctx.fillText(clazz, scaledX - 5, scaledY);

                    });
                };
                if (typeof e.target?.result === "string") {
                    img.src = e.target.result;
                }
            };
            reader.readAsDataURL(image);
        }
    }, [image, responseData]);

    return <canvas ref={canvasRef} />;
};

export default BoundingBoxes