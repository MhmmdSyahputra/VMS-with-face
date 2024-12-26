import React from 'react'
import { CardStatistik } from './component/cardStatistik'
import { HomeTable } from './component/table'
import { TbLogin, TbLogout, TbUser, TbUsersGroup } from 'react-icons/tb'
import { Center, Grid, Paper, Text, Flex } from '@mantine/core'
import { FaUserPlus } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const data = [
  { title: 'Pengunjung Hari Ini', value: '35', diff: 34, icon: <TbUser className="display-4" /> },
  { title: 'Pengunjung Didalam', value: '20', diff: -13, icon: <TbLogin className="display-4" /> },
  { title: 'Pengunjung Selesai', value: '15', diff: 18, icon: <TbLogout className="display-4" /> },
  {
    title: 'Total Pengunjung',
    value: '745',
    diff: 18,
    icon: <TbUsersGroup className="display-4" />
  }
]

export const HomePage: React.FC = () => {
  return (
    <>
      <Grid grow gutter="lg" style={{ height: '85vh' }}>
        <Grid.Col span={5}>
          <CardStatistik data={data} />
          <Paper p="md" radius="lg" mt="lg" shadow="lg" style={{ cursor: 'pointer' }}>
            <Link to="visitor/add" className="text-decoration-none" style={{ height: '100%' }}>
              <Flex h="100%" w="100%" direction="column" justify="center" align="center">
                <Center mb={20} c="gray">
                  <FaUserPlus className="display-1" />
                </Center>
                <Text fz={18} fw={700} c="gray.5">
                  Register New Visitors Here
                </Text>
              </Flex>
            </Link>
          </Paper>
        </Grid.Col>
        <Grid.Col span={7} style={{ height: '85vh' }}>
          <HomeTable />
        </Grid.Col>
      </Grid>
    </>
  )
}
