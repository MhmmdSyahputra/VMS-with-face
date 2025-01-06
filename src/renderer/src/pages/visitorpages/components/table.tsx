import {
  Paper,
  Text,
  Table,
  Button,
  SimpleGrid,
  Avatar,
  ScrollArea,
  Loader,
  Center
} from '@mantine/core'
import { Visitor } from '@renderer/interface/visitor.interface'
import React from 'react'
import { TbPlus } from 'react-icons/tb'
import { Link } from 'react-router-dom'
interface HeaderItem {
  label: string
  width: string | number
}

interface HeaderTable {
  header: HeaderItem[]
}

interface TableVisitorProps {
  loading: boolean
  error: string
  headerTable: HeaderTable
  visitors: Visitor[]
}

export const TableVisitor: React.FC<TableVisitorProps> = ({
  loading,
  error,
  headerTable,
  visitors
}) => {
  return (
    <>
      <Paper
        shadow="md"
        radius="lg"
        p={20}
        h="100%"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {loading ? (
          <Loader color="blue" m="auto" />
        ) : error ? (
          <Center style={{ height: '100%' }}>{error}</Center>
        ) : (
          <>
            <SimpleGrid cols={2} mb={'md'} spacing="lg" verticalSpacing="lg">
              <div>
                <Text fz="lg" fw={700}>
                  Daftar Pengunjung
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
                    <Table.Th></Table.Th>
                    {headerTable.header.map((item, index) => (
                      <Table.Th
                        key={index}
                        fw={700}
                        style={{
                          width: typeof item.width === 'number' ? `${item.width}px` : item.width
                        }}
                      >
                        {item.label}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <Table.Tr key={visitor.idpengunjung}>
                      <Table.Td>
                        <Avatar src={visitor.foto1} alt={visitor.nama} size={40} />
                      </Table.Td>
                      <Table.Td>{visitor.tanggal}</Table.Td>
                      <Table.Td>{visitor.kodetiket}</Table.Td>
                      <Table.Td>{visitor.nama}</Table.Td>
                      <Table.Td>{visitor.noktp}</Table.Td>
                      <Table.Td>{visitor.tujuan}</Table.Td>
                      <Table.Td>{visitor.alasan}</Table.Td>
                      <Table.Td>{visitor.telp}</Table.Td>
                    </Table.Tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          </>
        )}
      </Paper>
    </>
  )
}
