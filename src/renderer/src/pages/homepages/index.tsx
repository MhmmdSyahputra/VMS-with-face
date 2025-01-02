import React, { useEffect, useState } from 'react'
import { CardStatistik } from './components/cardStatistik'
import { HomeTable } from './components/table'
import { TbLogin } from 'react-icons/tb'
import { Center, Flex, Grid, Paper, SimpleGrid, Text } from '@mantine/core'
import ConfigService from '@renderer/services/config.service'
import { IGetDataStats } from '@renderer/interface/stats.interface'
import { Link } from 'react-router-dom'
import { FaUserPlus } from 'react-icons/fa6'

export const HomePage: React.FC = () => {
  const configService = ConfigService()

  const [dataStats, setDataStats] = useState<IGetDataStats>()

  const getDataStats = async (): Promise<void> => {
    try {
      const response = await configService.getDataStats()
      console.log(response)
      setDataStats(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDataStats()
  }, [])

  return (
    <>
      <Grid grow gutter="xl" style={{ height: '100vh' }}>
        <Grid.Col span={5}>
          <Grid>
            <Grid.Col span={6}>
              <CardStatistik
                icon={<TbLogin className="display-4" />}
                title="Total hari ini"
                value={dataStats?.totaltoday || '0'}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <CardStatistik
                icon={<TbLogin className="display-4" />}
                title="Total Pengunjung"
                value={dataStats?.totalvisitor || '0'}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <CardStatistik
                icon={<TbLogin className="display-4" />}
                title="Didalam"
                value={dataStats?.inside || '0'}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <CardStatistik
                icon={<TbLogin className="display-4" />}
                title="Selesai"
                value={dataStats?.returned || '0'}
              />
            </Grid.Col>
          </Grid>
          <SimpleGrid cols={1}>
            <Paper
              bg={'white'}
              p="md"
              radius="lg"
              mt="lg"
              shadow="md"
              style={{ cursor: 'pointer' }}
            >
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
        </Grid.Col>
        <Grid.Col span={7} style={{ height: '90vh' }}>
          <HomeTable />
        </Grid.Col>
      </Grid>
    </>
  )
}
