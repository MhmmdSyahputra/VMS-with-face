import { Grid } from '@mantine/core'
import React from 'react'
import { TableListEmploye } from './components/table'

export const EmployeePage: React.FC = () => {
  return (
    <>
      <Grid grow gutter="xl" style={{ height: '100vh' }}>
        <Grid.Col span={12} style={{ height: '90vh' }} pb={0}>
          <TableListEmploye />
        </Grid.Col>
      </Grid>
    </>
  )
}
