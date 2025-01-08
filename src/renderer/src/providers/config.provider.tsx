import { Loader, Paper, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IDataConfigApi } from '@renderer/interface/config.interface'
import { LoginPage } from '@renderer/pages'
import ConfigService from '@renderer/services/config.service'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface IAppContext extends IDataConfigApi {
  updateDataConfig: (updatedValues: Partial<IDataConfigApi>) => void
  footer1?: string
  footer2?: string
  header?: string
  subheader1?: string
  subheader2?: string
  userllogo?: string
}

const AppContext = createContext<IAppContext | undefined>(undefined)

export const useDataConfig = (): IAppContext => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useDataConfig must be used within a ConfigProvider')
  }
  return context
}

interface ConfigApiProps {
  children: ReactNode
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ConfigProvider = ({ children }: ConfigApiProps) => {
  const configService = ConfigService()
  // const initialState = {
  //   titlePerusahaan: 'VMS'
  // }

  const [dataConfig, setDataConfig] = useState<IDataConfigApi>()
  const [Loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const resConfig = await configService.getConfig()
        setDataConfig({
          header: resConfig.header || '',
          subheader1: resConfig.subheader1 || '',
          subheader2: resConfig.subheader2 || '',
          footer1: resConfig.footer1 || '',
          footer2: resConfig.footer2 || '',
          userllogo: resConfig.userllogo || ''
        })
        setLoading(false)
      } catch (error) {
        notifications.show({
          color: 'red',
          position: 'top-right',
          title: 'Get data config gagal!',
          message: `Terjadi kesalahan pada server`
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const updateDataConfig = (updatedValues): void => {
    setDataConfig((prevData) => ({
      ...prevData,
      ...updatedValues
    }))
  }

  if (Loading) {
    return (
      <Paper h="100vh" style={{ position: 'relative', backgroundColor: '#f4f4f4' }}>
        <Paper
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Loader color="blue" m="auto" pos="absolute" />
          <Text
            c={'#fff'}
            fw={700}
            style={{
              marginTop: '85px',
              textAlign: 'center'
            }}
          >
            LOADING CONFIG...
          </Text>
        </Paper>

        <Paper h={'100%'} m={'auto'} style={{ pointerEvents: 'none' }}>
          <LoginPage />
        </Paper>
      </Paper>
    )
  }

  return (
    <AppContext.Provider value={{ ...dataConfig, updateDataConfig }}>
      {children}
    </AppContext.Provider>
  )
}
