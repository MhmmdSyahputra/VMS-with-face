import React from 'react'
import { CardStatistik } from './component/cardStatistik'
import { HomeTable } from './component/table'
import { TbLogin, TbLogout, TbUser, TbUsersGroup } from 'react-icons/tb'

const data = [
  { title: 'Pengunjung Hari Ini', value: '35', diff: 34, icon: <TbUser className="display-4" /> },
  { title: 'Pengunjung Didalam', value: '20', diff: -13, icon: <TbLogin className="display-4" /> },
  { title: 'Pengunjung Selesai', value: '15', diff: 18, icon: <TbLogout className="display-4" /> },
  { title: 'Total Pengujung', value: '745', diff: 18, icon: <TbUsersGroup className="display-4" /> }
]

export const HomePage: React.FC = () => {
  return (
    <>
      <CardStatistik data={data} />
      <HomeTable />
    </>
  )
}
