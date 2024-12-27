import React from 'react'
import { CardStatistik } from './component/cardStatistik'
import { HomeTable } from './component/table'
import { TbLogin, TbLogout, TbUser, TbUsersGroup } from 'react-icons/tb'
import { Grid } from '@mantine/core'

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
      <Grid grow gutter="xl" style={{ height: '85vh' }}>
        <Grid.Col span={5}>
          <CardStatistik data={data} />
        </Grid.Col>
        <Grid.Col span={7} style={{ height: '85vh' }}>
          <HomeTable />
        </Grid.Col>
      </Grid>
    </>
  )
}
