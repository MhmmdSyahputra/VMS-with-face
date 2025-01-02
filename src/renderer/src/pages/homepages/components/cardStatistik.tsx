import React from 'react'
import { Grid, Paper, Text } from '@mantine/core'

interface Statistik {
  title: string
  value: string
  icon: JSX.Element
}

export const CardStatistik: React.FC<Statistik> = (data) => {
  return (
    <>
      <Paper p="md" radius="lg" shadow="md">
        <Grid>
          <Grid.Col span={12}>
            <Text c="blue.9" tt="uppercase" fw={700} fz="sm">
              {data.title}
            </Text>
          </Grid.Col>
          <Grid.Col span={5} c={'blue.2'}>
            {data.icon}
          </Grid.Col>
          <Grid.Col span={'auto'} my={'auto'}>
            <Text fw={700} fz="xl">
              {data.value}
            </Text>
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  )
}
