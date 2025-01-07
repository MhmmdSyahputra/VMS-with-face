import { Grid } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { TableEmployee } from './components/table'
import MemberService from '@renderer/services/member.service'
import { IMember } from '@renderer/interface/member.interface'

interface HeaderItem {
  label: string
  width: string | number
}

interface HeaderTable {
  header: HeaderItem[]
}

export const EmployeePage: React.FC = () => {
  const memberService = MemberService()
  const [headerTable, setHeaderTable] = useState<HeaderTable | null>(null)
  const [dataVisitors, setDataVisitors] = useState<IMember[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getHeaderTable = async (): Promise<void> => {
    try {
      const response = await memberService.getHeaderTableMember()
      const formattedHeader = {
        header: response.header.map(([label, width]) => ({
          label,
          width: isNaN(Number(width)) ? width : Number(width)
        }))
      }
      console.log(response);
      
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
      const response = await memberService.getDataMember()
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
          <TableEmployee
            error={error!}
            loading={loading}
            headerTable={headerTable!}
            member={dataVisitors}
          />
        </Grid.Col>
      </Grid>
    </>
  )
}
