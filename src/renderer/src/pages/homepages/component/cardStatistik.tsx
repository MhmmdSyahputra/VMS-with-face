import React from 'react'
import { Grid, Group, Paper, SimpleGrid, Text } from '@mantine/core'

interface Statistik {
  title: string
  value: string
  diff: number
  icon: JSX.Element
}

interface CardStatProps {
  data: Statistik[]
}

export const CardStatistik: React.FC<CardStatProps> = ({ data }) => {
  return (
    <SimpleGrid cols={2} spacing="lg" verticalSpacing="lg">
      {data.map((stat, index) => {
        return (
          <Paper key={index} p="md" radius="lg" shadow="lg">
            <Group justify="apart">
              <div>
                <Text c="blue.9" tt="uppercase" fw={700} fz="sm">
                  {stat.title}
                </Text>
                <Grid mt={15}>
                  <Grid.Col span={6} c={'blue.2'}>
                    {stat.icon}
                  </Grid.Col>
                  <Grid.Col span={6} my={'auto'}>
                    <Text fw={700} fz="xl">
                      {stat.value}
                    </Text>
                  </Grid.Col>
                </Grid>
              </div>
            </Group>
          </Paper>
        )
      })}
    </SimpleGrid>
  )
}
