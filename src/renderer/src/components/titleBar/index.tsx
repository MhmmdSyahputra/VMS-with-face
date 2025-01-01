import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Modal,
  Notification,
  Text,
  TextInput,
  rem
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaGear, FaMinus, FaXmark } from 'react-icons/fa6'
import { FaRegSave } from 'react-icons/fa'
import { BiWindows } from 'react-icons/bi'
import classes from './titleBar.module.css'
import { TbCheck, TbX } from 'react-icons/tb'

export const Titlebar: React.FC = () => {
  const [openedConfig, { open: openConfig, close: closeConfig }] = useDisclosure(false)
  const [openedConfirm, { open: openConfirm, close: closeConfirm }] = useDisclosure(false)

  const [deviceId, setDeviceId] = useState<string>('')
  const [dataConfig, setDataConfig] = useState({
    licenseKey: '',
    baseURL: '',
    secretCode: ''
  })
  const [errorDataConfig, setErrorDataConfig] = useState<{
    [key: string]: string
  }>({})
  const [showNotification, setShowNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const handleMinimize = (): void => window.electron.ipcRenderer.send('window:minimize')
  const handleMaximize = (): void => window.electron.ipcRenderer.send('window:maximize')
  const handleClose = (): void => {
    openConfirm() // Buka modal konfirmasi sebelum menutup
  }
  const confirmClose = (): void => {
    window.electron.ipcRenderer.send('window:close') // Lanjutkan menutup aplikasi
    closeConfirm() // Tutup modal konfirmasi
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setDataConfig((prevState) => ({
      ...prevState,
      [name]: value
    }))
    setErrorDataConfig((prevErrors) => ({ ...prevErrors, [name]: '' }))
  }

  const handleGetDeviceId = (): void => {
    window.electron.ipcRenderer.send('get-deviceID')
  }

  const handleSaveConfig = (): void => {
    const requiredFields = ['licenseKey', 'baseURL', 'secretCode']
    const newErrors: { [key: string]: string } = {}

    requiredFields.forEach((field) => {
      if (!dataConfig[field as keyof typeof dataConfig]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrorDataConfig(newErrors)
      return
    }
    localStorage.setItem('dataConfig', JSON.stringify(dataConfig))
    setShowNotification({ type: 'success', message: 'Konfigurasi berhasil disimpan!' })
    closeConfig()
  }

  useEffect(() => {
    handleGetDeviceId()
  }, [])

  useEffect(() => {
    const handleResponse = (_: Electron.IpcRendererEvent, data: string): void => {
      setDeviceId(data.replace('UUID', '').trim())
    }

    window.electron.ipcRenderer.on('uuid-response', handleResponse)
  }, [handleSaveConfig])

  useEffect(() => {
    if (showNotification) {
      const timeout = setTimeout(() => {
        setShowNotification(null)
      }, 5000)

      return (): void => clearTimeout(timeout)
    }
  }, [showNotification])

  useEffect(() => {
    const configKey = 'dataConfig'
    const existingConfig = localStorage.getItem(configKey)

    if (!existingConfig) {
      const defaultConfig = {
        licenseKey: '',
        baseURL: '',
        secretCode: ''
      }
      localStorage.setItem(configKey, JSON.stringify(defaultConfig))
      setDataConfig(defaultConfig)
    } else {
      setDataConfig(JSON.parse(existingConfig))
    }
  }, [openedConfig, openConfig, closeConfig])

  return (
    <Box bg="blue.8" className={classes.header}>
      <header>
        <Flex justify="space-between" py={5} align="center" h="100%">
          <Text color="white" size="sm" ps={10}>
            Visitor Management System
          </Text>
          <Flex className={classes.buttons}>
            <Button
              onClick={openConfig}
              className="my-auto"
              leftSection={<FaGear />}
              size="compact-sm"
              me={20}
            >
              <Text fz={'sm'} fw={500}>
                Config
              </Text>
            </Button>
            <Button onClick={handleMinimize} variant="filled" c="white" bg="blue.8" bd={0}>
              <FaMinus />
            </Button>
            <Button onClick={handleMaximize} variant="filled" c="white" bg="blue.8" bd={0}>
              <BiWindows />
            </Button>
            <Button onClick={handleClose} variant="filled" c="white" bg="blue.8" bd={0}>
              <FaXmark />
            </Button>
          </Flex>
        </Flex>
      </header>

      <Modal
        opened={openedConfig}
        radius={'md'}
        onClose={closeConfig}
        size={'55rem'}
        title="Update Configuration"
        centered
      >
        <Divider my="xs" label="Configurasi Aplication" labelPosition="left" />
        <Box mb={20}>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                value={deviceId}
                variant="filled"
                readOnly
                size="md"
                radius="md"
                label="DeviceID"
                placeholder=""
                mb={10}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={12}>
              <TextInput
                size="md"
                value={dataConfig.licenseKey}
                onChange={handleInputChange}
                name="licenseKey"
                radius="md"
                label="License Key"
                placeholder=""
                error={errorDataConfig.licenseKey}
                mb={10}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={9}>
              <TextInput
                size="md"
                value={dataConfig.baseURL}
                onChange={handleInputChange}
                name="baseURL"
                radius="md"
                label="Base URL"
                placeholder=""
                error={errorDataConfig.baseURL}
                mb={10}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                size="md"
                value={dataConfig.secretCode}
                onChange={handleInputChange}
                name="secretCode"
                radius="md"
                label="Secret Code"
                placeholder=""
                error={errorDataConfig.secretCode}
                mb={3}
              />
            </Grid.Col>
          </Grid>
        </Box>
        <Box>
          <Button
            onClick={() => handleSaveConfig()}
            radius={'md'}
            leftSection={<FaRegSave size={14} />}
          >
            Simpan
          </Button>
        </Box>
      </Modal>

      {showNotification && (
        <Notification
          icon={
            showNotification.type === 'success' ? (
              <TbCheck style={{ width: rem(20), height: rem(20) }} />
            ) : (
              <TbX style={{ width: rem(20), height: rem(20) }} />
            )
          }
          color={showNotification.type === 'success' ? 'teal' : 'red'}
          title={showNotification.type === 'success' ? 'Berhasil!' : 'Gagal!'}
          onClose={() => setShowNotification(null)}
          style={{ position: 'fixed', bottom: 20, right: 20 }}
        >
          {showNotification.message}
        </Notification>
      )}

      {/* Modal Konfirmasi Close */}
      <Modal opened={openedConfirm} onClose={closeConfirm} title="Confirmation?">
        <Text>Do you want to exit the application?</Text>
        <Divider my="md" />
        <Flex justify="flex-end" gap="md">
          <Button variant="default" onClick={closeConfirm}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmClose}>
            Yes
          </Button>
        </Flex>
      </Modal>
    </Box>
  )
}
