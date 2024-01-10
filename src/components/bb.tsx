"use client";
import React from 'react';


import { useEffect, useRef } from 'react';

const BoundingBoxes = ({ responseData, image }: { responseData: any, image: any }) => {
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
                        const scaledX = x * (scaleFactor);
                        const scaledY = y * (scaleFactor);
                        const scaledWidth = width * (scaleFactor);
                        const scaledHeight = height * (scaleFactor);
                        ctx.strokeStyle = "#FF0000";
                        ctx.lineWidth = 1;
                        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
                        ctx.strokeStyle = "#00FF00";
                        ctx.lineWidth = 1;
                        ctx.strokeText(clazz, scaledX - 1, scaledY);
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