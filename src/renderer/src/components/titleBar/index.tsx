import { Box, Button, Flex, Modal, Text, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaGear, FaMinus, FaXmark } from 'react-icons/fa6'
import { BiWindows } from 'react-icons/bi'
import React from 'react'
import classes from './titleBar.module.css'

export const Titlebar: React.FC = () => {
  const handleMinimize = (): void => window.electron.ipcRenderer.send('window:minimize')
  const handleMaximize = (): void => window.electron.ipcRenderer.send('window:maximize')
  const handleClose = (): void => window.electron.ipcRenderer.send('window:close')
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <Box bg="blue.8" className={classes.header}>
      <header>
        <Flex justify="space-between" py={5} align="center" h="100%">
          <Text color="white" size="sm" ps={10}>
            Visitor Management System
          </Text>
          <Flex className={classes.buttons}>
            <Button
              onClick={open}
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
      <Modal opened={opened} onClose={close} title="Update Config" centered>
        <TextInput size="md" radius="md" label="Base URL" placeholder="Input placeholder" mb={10}/>
        <TextInput size="md" radius="md" label="API" placeholder="Input placeholder" mb={3}/>
      </Modal>
    </Box>
  )
}
