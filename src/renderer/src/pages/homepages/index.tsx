import React, { useEffect, useState } from 'react'
import { CardStatistik } from './components/cardStatistik'
import { HomeTable } from './components/table'
import { TbLogin, TbUserCheck, TbUsersGroup } from 'react-icons/tb'
import { Center, Flex, Grid, Paper, SimpleGrid, Text } from '@mantine/core'
import ConfigService from '@renderer/services/config.service'
import { IGetDataStats } from '@renderer/interface/stats.interface'
import { Link } from 'react-router-dom'
import { FaUserPlus } from 'react-icons/fa6'
import VisitorService from '@renderer/services/visitor.service'
import { Visitor } from '@renderer/interface/visitor.interface'
interface HeaderItem {
  label: string
  width: string | number
}

interface HeaderTable {
  header: HeaderItem[]
}

export const HomePage: React.FC = () => {
  const configService = ConfigService()
  const visitorService = VisitorService()

  const [dataStats, setDataStats] = useState<IGetDataStats>()
  const [headerTable, setHeaderTable] = useState<HeaderTable>()
  const [dataVisitors, setDataVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getDataStats = async (): Promise<void> => {
    try {
      const response = await configService.getDataStats()
      setDataStats(response)
    } catch (error) {
      console.error('Error fetching data stats:', error)
    }
  }

  const getHeaderTable = async (): Promise<void> => {
    try {
      const response = await visitorService.getHeaderTableVisitor()
      const formattedHeader = {
        header: response.header.map(([label, width]) => ({
          label,
          width: isNaN(Number(width)) ? width : Number(width)
        }))
      }
      setHeaderTable(formattedHeader)
      await getDataVisitor()
    } catch (error) {
      setError('Terjadi kesalahan pada server')
    } finally {
      setLoading(false)
    }
  }

  const getDataVisitor = async (): Promise<void> => {
    try {
      const response = await visitorService.getDataVisitor()
      setDataVisitors(response)
    } catch (error) {
      setError('Terjadi kesalahan pada server')
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    getDataStats()
    getHeaderTable()
  }, [])

  return (
    <>
      <Grid grow gutter="md" style={{ height: '100vh' }}>
        <Grid.Col span={2}>
          <Grid grow gutter="lg">
            <Grid.Col span={12}>
              <CardStatistik
                icon={<TbLogin className="display-4" />}
                title="Total hari ini"
                value={dataStats?.totaltoday || '0'}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <CardStatistik
                icon={<TbUsersGroup className="display-4" />}
                title="Total Pengunjung"
                value={dataStats?.totalvisitor || '0'}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <CardStatistik
                icon={<TbLogin className="display-4" />}
                title="Didalam"
                value={dataStats?.inside || '0'}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <CardStatistik
                icon={<TbUserCheck className="display-4" />}
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
                  <Text fz={16} fw={700} c="blue.9">
                    Register New Visitors Here
                  </Text>
                </Flex>
              </Link>
            </Paper>
          </SimpleGrid>
        </Grid.Col>
        <Grid.Col span={9} style={{ height: '90vh' }}>
          <HomeTable
            error={error!}
            loading={loading}
            headerTable={headerTable!}
            visitors={dataVisitors}
          />
        </Grid.Col>
      </Grid>
    </>
  )
}
