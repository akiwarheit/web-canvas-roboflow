"use client";

import Upload from '@/components/upload';
import { QuarterContext } from '@/context/quarter';
import useProducts from '@/hooks/useProducts';
import useStore from '@/hooks/useStore';
import { BadgeDelta, Card, Col, Flex, Grid, Subtitle, Tab, TabGroup, TabList, TabPanel, TabPanels, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Text, Title } from '@tremor/react';
import { useMemo, useState } from 'react';

type ComparisonResult = 'decrease' | 'moderateDecrease' | 'unchanged' | 'moderateIncrease' | 'increase';

function compareValues(value1: number, value2: number): ComparisonResult {
  if (value1 === 0 && value2 === 0)
    return 'unchanged'


  const percentageChange = ((value2 - value1) / value1) * 100;

  if (percentageChange < -5) {
    return 'decrease';
  } else if (percentageChange >= -5 && percentageChange < 0) {
    return 'moderateDecrease';
  } else if (percentageChange === 0) {
    return 'unchanged';
  } else if (percentageChange > 0 && percentageChange <= 5) {
    return 'moderateIncrease';
  } else {
    return 'increase';
  }
}

export default function Home() {
  const { title, msid, address1, address2, lat, lng } = useStore()

  const [q1, setQ1] = useState<string[]>([]);
  const [q2, setQ2] = useState<string[]>([]);
  const [q3, setQ3] = useState<string[]>([]);
  const [q4, setQ4] = useState<string[]>([]);

  const products = useProducts()

  const productsWithQuarter = useMemo(() => {
    function checkExists(cid: string, q: string[]) {
      if (!q) {
        return false;
      }

      return q.indexOf(cid) > -1
    }

    return products.map(product => ({
      ...product,
      q1: checkExists(product.cid, q1),
      q2: checkExists(product.cid, q2),
      q3: checkExists(product.cid, q3),
      q4: checkExists(product.cid, q4),
    }))
  }, [products, q1, q2, q3, q4])

  const qOverview = useMemo(() => {
    const overview = [q1, q2, q3, q4].map((q, idx) => {
      if (q) {
        return { val: Math.floor([...new Set(q)].length / products.length * 100), "quarter": idx + 1 }
      } else {
        return { val: 0, "quarter": idx + 1 }
      }
    })

    return overview
  }, [products.length, q1, q2, q3, q4])

  return (
    <main className="p-12 bg-white">
      <QuarterContext.Provider value={{ q1, q2, q3, q4, setQ1, setQ2, setQ3, setQ4 }}>
        <Card className="max-w-lg mx-auto mb-6">
          <Title>{title}</Title>
          <Subtitle>MSID: {msid}</Subtitle>
          <Text>{address1}</Text>
          <Text>{address2}</Text>
          <Flex justifyContent="end" className="mt-4">
            <Text>{lat}, {lng}</Text>
          </Flex>
        </Card>
        <Grid numItems={4} className="gap-6 mb-6">
          <Col numColSpan={1}>
            <Card>
              <Flex justifyContent="between" alignItems="center">
                <Text>Q1 2024</Text>
                <BadgeDelta deltaType="unchanged" size="xs">
                  {qOverview[0].val}%
                </BadgeDelta>
              </Flex>
            </Card>
          </Col>
          <Col numColSpan={1}>
            <Card>
              <Flex justifyContent="between" alignItems="center">
                <Text>Q2 2024</Text>
                <BadgeDelta deltaType={compareValues(qOverview[0].val, qOverview[1].val)} size="xs">
                  {qOverview[1].val}%
                </BadgeDelta>
              </Flex>
            </Card>
          </Col>
          <Col numColSpan={1}>
            <Card>
              <Flex justifyContent="between" alignItems="center">
                <Text>Q3 2024</Text>
                <BadgeDelta deltaType={compareValues(qOverview[1].val, qOverview[2].val)} size="xs">
                  {qOverview[2].val}%
                </BadgeDelta>
              </Flex>
            </Card>
          </Col>
          <Col numColSpan={1}>
            <Card>
              <Flex justifyContent="between" alignItems="center">
                <Text>Q4 2024</Text>
                <BadgeDelta deltaType={compareValues(qOverview[2].val, qOverview[3].val)} size="xs">
                  {qOverview[3].val}%
                </BadgeDelta>
              </Flex>
            </Card>
          </Col>

        </Grid >
        <TabGroup>
          <TabList className="mt-8">
            <Tab>Overview</Tab>
            <Tab>Quarter 1</Tab>
            <Tab>Quarter 2</Tab>
            <Tab>Quarter 3</Tab>
            <Tab>Quarter 4</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(products[0]).map((key: string) => <TableHeaderCell key={key}>{key}</TableHeaderCell>)}
                    <TableHeaderCell>q1</TableHeaderCell>
                    <TableHeaderCell>q2</TableHeaderCell>
                    <TableHeaderCell>q3</TableHeaderCell>
                    <TableHeaderCell>q4</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsWithQuarter.map(({ mbid, description, pack, upc, cid, q1, q2, q3, q4 }) =>
                    <TableRow key={mbid}>
                      <TableCell>{mbid}</TableCell>
                      <TableCell>{description}</TableCell>
                      <TableCell>{pack}</TableCell>
                      <TableCell>{upc}</TableCell>
                      <TableCell>{cid}</TableCell>
                      <TableCell>
                        {q1 && <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>}
                      </TableCell>
                      <TableCell>
                        {q2 && <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>}
                      </TableCell>
                      <TableCell>
                        {q3 && <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>}
                      </TableCell>
                      <TableCell>
                        {q4 && <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>}
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </TabPanel>
            <TabPanel>
              <Upload quarter="q1" />
            </TabPanel>
            <TabPanel>
              <Upload quarter="q2" />
            </TabPanel>
            <TabPanel>
              <Upload quarter="q3" />
            </TabPanel>
            <TabPanel>
              <Upload quarter="q4" />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </QuarterContext.Provider>
    </main >
  )
} 
