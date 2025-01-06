import { Grid } from '@mantine/core'
import { Visitor } from '@renderer/interface/visitor.interface'
import VisitorService from '@renderer/services/visitor.service'
import React, { useEffect, useState } from 'react'
import { TableVisitor } from './components/table'

interface HeaderItem {
  label: string
  width: string | number
}

interface HeaderTable {
  header: HeaderItem[]
}

export const VisitorPage: React.FC = () => {
  const visitorService = VisitorService()
  const [headerTable, setHeaderTable] = useState<HeaderTable | null>(null)
  const [dataVisitors, setDataVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getHeaderTable = async (): Promise<void> => {
    try {
      const response = await visitorService.getHeaderTableVisitor()
      const formattedHeader = {
        header: response.header.map(([label, width]) => ({
          label,
          width: isNaN(Number(width)) ? width : Number(width)
        }))
      }
      setHeaderTable(formattedHeader)
      await getDataVisitor()
    } catch (error) {
      setError('Terjadi kesalahan pada server')
    } finally {
      setLoading(false)
    }
  }

  const getDataVisitor = async (): Promise<void> => {
    try {
      const response = await visitorService.getDataVisitor()
      setDataVisitors(response)
    } catch (error) {
      setError('Terjadi kesalahan pada server')
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    getHeaderTable()
  }, [])

  return (
    <>
      <Grid grow gutter="xl" style={{ height: '100vh' }}>
        <Grid.Col span={12} style={{ height: '90vh' }} pb={0}>
          <TableVisitor
            error={error!}
            loading={loading}
            headerTable={headerTable!}
            visitors={dataVisitors}
          />
        </Grid.Col>
      </Grid>
    </>
  )
}
