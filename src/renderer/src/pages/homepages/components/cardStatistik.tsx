import React from 'react'
import { Center, Flex, Grid, Group, Paper, SimpleGrid, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import { FaUserPlus } from 'react-icons/fa6'

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
    <>
      <SimpleGrid cols={2} spacing="lg" verticalSpacing="lg">
        {data.map((stat, index) => {
          return (
            <Paper key={index} p="md" radius="lg" shadow="md">
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
      <SimpleGrid cols={1}>
        <Paper bg={'white'} p="md" radius="lg" mt="lg" shadow="md" style={{ cursor: 'pointer' }}>
          <Link to="visitor/add" className="text-decoration-none" style={{ height: '100%' }}>
            <Flex h="100%" w="100%" direction="column" justify="center" align="center">
              <Center mb={20} c="blue.2">
                <FaUserPlus className="display-1" />
              </Center>
              <Text fz={18} fw={700} c="blue.9">
                Register New Visitors Here
              </Text>
            </Flex>
          </Link>
        </Paper>
      </SimpleGrid>
    </>
  )
}
