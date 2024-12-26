import React from 'react'
import { Grid, Group, Paper, Text } from '@mantine/core'

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
    <Grid grow mb={50}>
      {data.map((stat, index) => {
        return (
          <Grid.Col span={3} key={index}>
            <Paper p="md" radius="lg" shadow="lg">
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
          </Grid.Col>
        )
      })}
    </Grid>
  )
}
