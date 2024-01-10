"use client";

import useInference from "@/hooks/useInference";
import { List, ListItem } from "@tremor/react";
import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import BoundingBoxes from "./bb";
import { QuarterContext, QuarterContextType } from "@/context/quarter";

export default function Upload({ quarter }: { quarter: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  return (
    <div>
      {response && <BoundingBoxes key={`${quarter}-bb`} responseData={response} image={selectedFile} />}
      <div className="mb-6" />
      {response && <List className="mb-6">
        {response.predictions.map(({ x, y, id, class: clazz, confidence }: any) => (
          <ListItem key={`${quarter}${x}${y}${id}`}>
            <span>{clazz}</span>
            <span>{(confidence * 100).toFixed(2)}%</span>
          </ListItem>
        ))}
      </List>}
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

