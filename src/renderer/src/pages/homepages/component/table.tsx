import { Paper, Text, Table, Grid, Button } from '@mantine/core'
import React, { useState } from 'react'
import { TbPlus } from 'react-icons/tb'
import { Link } from 'react-router-dom'

interface DataPengunjung {
  nama: string
  tanggal: string
  jammasuk: string
  jamkeluar: string
  status: string
}

export const HomeTable: React.FC = () => {
  const [dataPengunjung] = useState<DataPengunjung[]>([
    {
      nama: 'Muhammad Syahputra',
      tanggal: '20 Desember 2024',
      jammasuk: '08:20',
      jamkeluar: '12:18',
      status: 'selesai'
    },
    {
      nama: 'Fikri',
      tanggal: '20 Desember 2024',
      jammasuk: '09:32',
      jamkeluar: '10:30',
      status: 'selesai'
    },
    {
      nama: 'Andika',
      tanggal: '20 Desember 2024',
      jammasuk: '10:20',
      jamkeluar: '13:10',
      status: 'selesai'
    }
  ])

  return (
    <div>
      <Paper shadow="lg" radius="md" p={20}>
        <Grid mb={10}>
          <Grid.Col span={10}>
            <Text fz="lg" fw={600}>
              Daftar Pengunjung Terbaru
            </Text>
          </Grid.Col>
          <Grid.Col span={2} ta={'right'}>
            <Link to="/visitor/add">
              <Button variant="outline">
                <TbPlus className="me-2" /> Tambah
              </Button>
            </Link>
          </Grid.Col>
        </Grid>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={10}>No</Table.Th>
              <Table.Th>Nama</Table.Th>
              <Table.Th w={160}>Tanggal</Table.Th>
              <Table.Th w={100}>Jam Masuk</Table.Th>
              <Table.Th w={100}>Jam Keluar</Table.Th>
              <Table.Th w={100}>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {dataPengunjung.map((data, index) => (
              <Table.Tr key={index}>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{data.nama}</Table.Td>
                <Table.Td>{data.tanggal}</Table.Td>
                <Table.Td>{data.jammasuk}</Table.Td>
                <Table.Td>{data.jamkeluar}</Table.Td>
                <Table.Td>{data.status}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  )
}
