import { Loader, Paper } from '@mantine/core'
import { IDataConfigApi } from '@renderer/interface/config.interface'
import ConfigService from '@renderer/services/config.service'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface IAppContext extends IDataConfigApi {
  updateDataConfig: (updatedValues: Partial<IDataConfigApi>) => void
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
      } catch (error) {
        console.log(error)
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

  if (!dataConfig || Object.keys(dataConfig).length === 0) {
    return (
      <Paper
        shadow="md"
        radius="lg"
        p={20}
        h="100%"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Loader color="blue" m="auto" />
      </Paper>
    )
  }

  return (
    <AppContext.Provider value={{ ...dataConfig, updateDataConfig }}>
      {children}
    </AppContext.Provider>
  )
}
