import {
  Paper,
  Text,
  Table,
  Button,
  SimpleGrid,
  ScrollArea,
  Loader,
  Center,
  Group,
  ActionIcon
} from '@mantine/core'
import { IMember } from '@renderer/interface/member.interface'
import React from 'react'
import { TbSearch, TbUserSquare } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router-dom'
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
  member: IMember[]
}

export const TableEmployee: React.FC<TableVisitorProps> = ({
  loading,
  error,
  headerTable,
  member
}) => {
  const navigate = useNavigate()

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
                  Daftar Karyawan
                </Text>
              </div>
              <div className="text-end">
                <Group justify="flex-end">
                  <Link to="/employee/detail/0">
                    <Button>
                      <TbSearch className="me-2" /> Cari
                    </Button>
                  </Link>
                </Group>
              </div>
            </SimpleGrid>
            <ScrollArea>
              <Table verticalSpacing="md" striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
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
                    <Table.Th fw={700} w={80}>
                      Aksi
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody style={{ cursor: 'pointer' }}>
                  {member.map((visitor, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{visitor.kodemember}</Table.Td>
                      <Table.Td>{visitor.nama}</Table.Td>
                      <Table.Td>{visitor.namaprsh}</Table.Td>
                      <Table.Td>{visitor.telp}</Table.Td>
                      <Table.Td>{visitor.noktp}</Table.Td>
                      <Table.Td onClick={() => navigate(`/employee/detail/${visitor.kodemember}`)}>
                        <ActionIcon variant="filled" aria-label="Settings">
                          <TbUserSquare style={{ width: '70%', height: '70%' }} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </>
        )}
      </Paper>
    </>
  )
}
