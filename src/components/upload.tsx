"use client";

import useInference from "@/hooks/useInference";
import { Col, Grid, List, ListItem, ProgressBar } from "@tremor/react";
import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import BoundingBoxes from "./bb";
import { QuarterContext, QuarterContextType } from "@/context/quarter";


function Loading() {

  return <div aria-label="Loading..." role="status" className="flex items-center space-x-2">
    <svg className="h-20 w-20 animate-spin stroke-gray-500" viewBox="0 0 256 256">
      <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
      <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round"
        strokeWidth="24"></line>
      <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24">
      </line>
      <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round"
        strokeWidth="24"></line>
      <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24">
      </line>
      <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round"
        strokeWidth="24"></line>
      <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
      <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24">
      </line>
    </svg>
    <span className="text-4xl text-gray-500">Classifying...</span>
  </div>
}

export default function Upload({ quarter }: { quarter: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confidence, setConfidence] = useState(75)
  const { setQ1, setQ2, setQ3, setQ4 } = useContext(QuarterContext) as QuarterContextType;

  const setForQuarter = useCallback((val: string[]) => {
    if (quarter === "q1") {
      setQ1(val)
      return;
    } else if (quarter === "q2") {
      setQ2(val)
      return;
    } else if (quarter === "q3") {
      setQ3(val)
      return;
    }

    setQ4(val)
  }, [quarter, setQ1, setQ2, setQ3, setQ4])

  const response = useInference(selectedFile)

  useEffect(() => {
    const classes = response?.predictions.map(pred => pred.class) as string[]
    setForQuarter(classes)
  }, [response, setForQuarter])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleOnConfidenceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfidence(Number(event.target.value))
  };

  return (
    <div className="space-y-6">
      {response && <Grid numItems={2} className="gap-6" >
        <Col>
          <BoundingBoxes key={`${quarter}-bb`} responseData={response} image={selectedFile} />
        </Col>
        <Col>
          <List>
            {response.predictions.map(({ x, y, id, class: clazz, confidence }: any) => (
              <ListItem key={`${quarter}${x}${y}${id}`}>
                <span>{clazz}</span>
                <span>{(confidence * 100).toFixed(2)}%</span>
              </ListItem>
            ))}
          </List>
        </Col>
      </Grid>}
      <div className="space-y-4 p-2">
        <div>
          <p className="text-black">When you upload an image using the file input below, the image will be sent to our image classifier model. The model will analyze the image and return predictions, which may include identifying objects, features, or other relevant classifications within the image. The results will be displayed along with the confidence levels of each prediction. Please ensure that the image is in a supported format (such as JPEG, PNG, etc.) before uploading.</p>
        </div>
        <div>
          <span className="text-black">To upload an image:</span>
        </div>
        <ol className="text-black list-decimal ml-8">
          <li>Click on the `Choose File` button.</li>
          <li>Select an image file from your device.</li>
          <li>The image will be automatically uploaded and processed by the classifier.</li>
        </ol>
        <div>
          <p className="text-black">The <code>confidence</code> field allows users to specify a minimum confidence threshold, ensuring that only detections with a confidence score equal to or greater than the specified threshold are included in the final results.</p>
        </div>
        <div className="flex-inline space-x-4 text-black">
          <label>Confidence:</label>
          <input type="number" onChange={handleOnConfidenceChange} placeholder="(1-100)" value={confidence} />
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </div>
      </div>
      {!response && selectedFile && <Loading />}
    </div>
  );
}

