"use client";
import React from 'react';


import useInference from '@/hooks/useInference';
import useStoreCompletion from '@/hooks/useStoreCompletion';
import { Card, Col, Color, Flex, Grid, List, ListItem, Text, Title, Tracker } from '@tremor/react';
import { ChangeEvent, useState } from 'react';
import BoundingBoxes from '@/components/bb';

const stores = require("@/mock/stores.json")

interface Tracker {
  color: Color;
  tooltip: string;
}

function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const response = useInference(selectedFile)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div>
      {response && <BoundingBoxes responseData={response} image={selectedFile} />}
      {response && <List>
        {(response as any).predictions.map(({ x, y, id, class: clazz, confidence }: any) => (
          <ListItem key={`${x}${y}${id}`}>
            <span>{clazz}</span>
            <span>{(confidence * 100).toFixed(2)}%</span>
          </ListItem>
        ))}
      </List>}


      <input type="file" onChange={handleFileChange} />
    </div>
  );
}


export default function Home() {
  const data = useStoreCompletion() as Tracker[]

  return (
    <main className="p-12">
      <Grid numItems={3} className="gap-6">
        <Col numColSpan={1} >
          <Card>
            <Title>{stores[0].name}</Title>
            <Text>{stores[0].address1}</Text>
            <Text>{stores[0].address2}</Text>
            <Flex justifyContent="end" className="mt-4">
              <Text>{stores[0].person}</Text>
            </Flex>
            <Tracker data={data} className="mt-2" />
          </Card>
        </Col>
        <Col numColSpan={2}>
          <Card>
            <Upload />
          </Card>
        </Col>
      </Grid >
    </main >
  )
} 
