import {
  Paper,
  Text,
  Table,
  Button,
  SimpleGrid,
  Avatar,
  ScrollArea,
  Loader,
  Center,
  Group,
  Box,
  Grid,
  Modal,
  Image
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IHistoryVisitor, Visitor } from '@renderer/interface/visitor.interface'
import VisitorService from '@renderer/services/visitor.service'
import React, { useState } from 'react'
import { TbPlus } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import useCookie from 'react-use-cookie'

interface HeaderItem {
  label: string
  width: string | number
}

interface HeaderTable {
  header: HeaderItem[]
}

interface HomeTableProps {
  refreshData: () => void
  loading: boolean
  error: string
  headerTable: HeaderTable
  visitors: Visitor[]
}

export const HomeTable: React.FC<HomeTableProps> = ({
  loading,
  error,
  headerTable,
  visitors,
  refreshData
}) => {
  const visitorService = VisitorService()
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor>()
  const [selectedHistory, setSelectedHistory] = useState<IHistoryVisitor[]>([])
  const [openedModalDetail, { open: openModalDetail, close: closeModalDetail }] =
    useDisclosure(false)
  const [cookieLogin] = useCookie('userLoginCookie')
  const userLoginCookie = cookieLogin ? JSON.parse(cookieLogin) : null

  const handleClickTable = async (data: Visitor): Promise<void> => {
    setSelectedVisitor(data)
    const response = await visitorService.historyDataVisitor({
      idpengunjung: data.idpengunjung,
      tanggal: data.tanggal,
      createby: data.createby
    })
    setSelectedHistory(response)
    openModalDetail()
  }

  const handleClearSesiVisitor = async (): Promise<void> => {
    try {
      const response = await visitorService.clearSessionVisitor({
        idpengunjung: selectedVisitor!.idpengunjung,
        kodetiket: selectedVisitor!.kodetiket,
        userid: userLoginCookie.userid
      })
      if (response.valid === 1) {
        refreshData()
        closeModalDetail()
        notifications.show({
          color: 'green',
          position: 'top-right',
          title: 'Berhasil',
          message: response.msgtext
        })
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        position: 'top-right',
        title: 'Gagal',
        message: 'Terjadi kesalahan pada server'
      })
    }
  }

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
              <Table verticalSpacing="md" striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    {headerTable.header.map((item, index) => (
                      <Table.Th
                        key={index}
                        fw={700}
                        // style={{
                        //   width: typeof item.width === 'number' ? `${item.width}px` : item.width
                        // }}
                      >
                        {item.label}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody style={{ cursor: 'pointer' }}>
                  {visitors.map((visitor) => (
                    <Table.Tr key={visitor.idpengunjung}>
                      <Table.Td onClick={() => handleClickTable(visitor)}>
                        <Avatar src={visitor.foto1} alt={visitor.nama} size={40} />
                      </Table.Td>
                      <Table.Td onClick={() => handleClickTable(visitor)}>
                        {visitor.tanggal}
                      </Table.Td>
                      <Table.Td onClick={() => handleClickTable(visitor)}>
                        {visitor.kodetiket}
                      </Table.Td>
                      <Table.Td onClick={() => handleClickTable(visitor)}>{visitor.nama}</Table.Td>
                      <Table.Td onClick={() => handleClickTable(visitor)}>{visitor.noktp}</Table.Td>
                      <Table.Td onClick={() => handleClickTable(visitor)}>
                        {visitor.tujuan}
                      </Table.Td>
                      <Table.Td onClick={() => handleClickTable(visitor)}>
                        {visitor.alasan}
                      </Table.Td>
                      <Table.Td onClick={() => handleClickTable(visitor)}>{visitor.telp}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </>
        )}
      </Paper>

      <Modal
        opened={openedModalDetail}
        radius={'md'}
        withCloseButton={false}
        onClose={closeModalDetail}
        size={'55rem'}
        // title="HISTORY OF VISITOR"
        centered
      >
        <Group justify="space-between" pb={'lg'}>
          <Text fw={700} size="lg" c={'blue'}>
            HISTORY OF VISITOR
          </Text>
          <Text fw={700} size="lg" c={'red'} style={{ textTransform: 'uppercase' }}>
            {selectedVisitor?.nama}
          </Text>
        </Group>
        <Box mb={20}>
          <Grid>
            <Grid.Col span={12}>
              <ul className="list-group list-group-flush mb-3">
                {selectedHistory &&
                  selectedHistory
                    .filter((_, index) => index !== 0)
                    .map((item, index) => (
                      <li className="list-group-item table-bordered py-3" key={index}>
                        <div className="row">
                          <div className="col-4 text-start">{item.tanggal}</div>
                          <div className="col-2 text-start">{item.idgate}</div>
                          <div className="col-4 text-start">
                            <div
                              className="swal-html-content"
                              style={{
                                maxHeight: '200px',
                                overflow: 'auto'
                              }}
                            >
                              {item.aksi}
                            </div>
                          </div>
                          <div className="col text-start">{item.lantai}</div>
                        </div>
                      </li>
                    ))}
              </ul>
              <Group justify="center">
                <Image radius="md" src={selectedVisitor?.foto1} />
                <Image radius="md" src={selectedVisitor?.foto2} />
                <Image radius="md" src={selectedVisitor?.foto3} />
              </Group>
            </Grid.Col>
          </Grid>
        </Box>
        <Group justify="space-between">
          <Button
            radius={'md'}
            size="lg"
            disabled={
              selectedVisitor?.statuspengunjung && parseInt(selectedVisitor?.statuspengunjung) >= 3
                ? true
                : false
            }
            onClick={() => handleClearSesiVisitor()}
          >
            CLEAR SESSION
          </Button>
          <Button radius={'md'} size="lg" bg={'red'} onClick={closeModalDetail}>
            CLOSE
          </Button>
        </Group>
      </Modal>
    </>
  )
}
