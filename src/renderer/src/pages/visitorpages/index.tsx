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
    } catch (error) {
      console.error('Error fetching header table:', error)
    }
  }

  const getDataVisitor = async (): Promise<void> => {
    try {
      const response = await visitorService.getDataVisitor()
      setDataVisitors(response)
    } catch (error) {
      console.error('Error fetching header table:', error)
    }
  }

  useEffect(() => {
    getHeaderTable()
    getDataVisitor()
  }, [])

  return (
    <>
      <Grid grow gutter="xl" style={{ height: '100vh' }}>
        <Grid.Col span={12} style={{ height: '85vh' }} pb={0}>
          {headerTable ? (
            <TableVisitor headerTable={headerTable} visitors={dataVisitors} />
          ) : (
            <p>Loading header table...</p>
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}
