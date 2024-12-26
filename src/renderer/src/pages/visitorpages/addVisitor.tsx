import { Grid, Input, Paper, Text } from '@mantine/core'
import React from 'react'

export const AddVisitorPage: React.FC = () => {
  return (
    <>
      <Paper shadow="lg" radius="md" p={20}>
        <Grid mb={10}>
          <Grid.Col span={12}>
            <Text fz="lg" fw={600}>
              Tambah Pengunjung Baru
            </Text>
          </Grid.Col>
        </Grid>
        <Input.Wrapper label="Nama" withAsterisk description="" error="">
          <Input size="md" placeholder="Nama Pengunjung.." />
        </Input.Wrapper>
      </Paper>
    </>
  )
}
