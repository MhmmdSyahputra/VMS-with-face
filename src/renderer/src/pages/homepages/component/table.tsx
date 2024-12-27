import { Paper, Text, Table, Button, SimpleGrid, Avatar, ScrollArea, Badge } from '@mantine/core'
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
    },
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
    },
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
    <>
      <Paper
        shadow="md"
        radius="lg"
        p={20}
        h="100%"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <SimpleGrid cols={2} mb={'md'} spacing="lg" verticalSpacing="lg">
          <div>
            <Text fz="lg" fw={700}>
              Daftar Pengunjung Terbaru
            </Text>
          </div>
          <div className="text-end">
            <Link to="/visitor/add">
              <Button variant="outline">
                <TbPlus className="me-2" /> Tambah
              </Button>
            </Link>
          </div>
        </SimpleGrid>
        <ScrollArea>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={10}>No</Table.Th>
                <Table.Th>Photo</Table.Th>
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
                  <Table.Td py={20}>{index + 1}</Table.Td>
                  <Table.Td py={20}>
                    <Avatar
                      src={
                        'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsfGVufDB8fDB8fHww'
                      }
                      alt="it's me"
                    />
                  </Table.Td>
                  <Table.Td py={20}>{data.nama}</Table.Td>
                  <Table.Td py={20}>{data.tanggal}</Table.Td>
                  <Table.Td py={20}>{data.jammasuk}</Table.Td>
                  <Table.Td py={20}>{data.jamkeluar}</Table.Td>
                  <Table.Td py={20}>
                    <Badge color="blue">{data.status}</Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </>
  )
}
