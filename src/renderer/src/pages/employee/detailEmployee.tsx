import {
  Grid,
  Input,
  Paper,
  Button,
  Box,
  Text,
  Flex,
  Center,
  Modal,
  AspectRatio
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React, { useState, useRef, useEffect } from 'react'
import { MdOutlinePhotoCameraFront } from 'react-icons/md'
import Webcam from 'react-webcam'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import EmployeeService from '@renderer/services/employee.service'
import { notifications } from '@mantine/notifications'
import { IGetDetailEmplooye } from '@renderer/interface/employee.interface'

const initData = {
  valid: 0,
  idmember: '',
  idprsh: '',
  namaprsh: '',
  nama: '',
  telp: '',
  email: '',
  noktp: '',
  jeniskelamin: '',
  alamat: '',
  masaaktif: '',
  selamanya: '',
  ket: ''
}

export const AddEmployeePage: React.FC = () => {
  const employeeService = EmployeeService()
  const [formData, setFormData] = useState<IGetDetailEmplooye>(initData)
  const [noKartuInput, setNoKartuInput] = useState<string>('')
  const [opened, { open, close }] = useDisclosure(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cropper, setCropper] = useState<Cropper | null>(null)
  const [cropStatus, setCropperStatus] = useState<boolean>(false)
  const webcamRef = useRef<Webcam>(null)
  const cropperRef = useRef<HTMLImageElement>(null)

  const checkNoKartu = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    try {
      const response = await employeeService.getDetailEmployee(noKartuInput)

      if (response.msgtext && response.msgtext.length > 0) {
        notifications.show({
          color: 'red',
          position: 'top-right',
          title: 'Gagal',
          message: 'Terjadi kesalahan pada server!'
        })
      }

      if (response.valid == 1) {
        setFormData(response)
      } else {
        setFormData(initData)
        setNoKartuInput('')
        notifications.show({
          color: 'red',
          position: 'top-right',
          title: 'Gagal',
          message: `${response.msgtext}`
        })
      }
    } catch (error) {
      setFormData(initData)
      setNoKartuInput('')
      notifications.show({
        color: 'red',
        position: 'top-right',
        title: 'Gagal',
        message: 'Terjadi kesalahan pada server!'
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (): void => {
    if (validateForm()) {
      console.log('Form submitted:', formData)
    }
  }

  const capturePhoto = (): void => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      setCapturedImage(imageSrc)
      open()
    }
  }

  const retakePhoto = (): void => {
    setCapturedImage(null)
    open()
    setCropperStatus(false)
  }

  useEffect(() => {
    if (capturedImage && cropperRef.current) {
      const newCropper = new Cropper(cropperRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        scalable: true,
        zoomable: true,
        autoCropArea: 1,
        responsive: true
      })
      setCropper(newCropper)
    }

    return (): void => {
      if (cropper) {
        cropper.destroy()
      }
    }
  }, [capturedImage])

  const handleCrop = (): void => {
    if (cropper) {
      const croppedImageUrl = cropper.getCroppedCanvas().toDataURL('image/jpeg')
      setCapturedImage(croppedImageUrl)
      close()
      setCropperStatus(true)
    }
  }

  return (
    <>
      <Grid grow gutter="xl" h={'100vh'}>
        {/* COL FOR INPUT */}
        <Grid.Col span={7}>
          <Paper shadow="lg" radius="lg" p={20} h={'85vh'}>
            <Grid grow gutter="xl" h={'100vh'}>
              <Grid.Col span={12} pb={0}>
                <form onSubmit={checkNoKartu}>
                  <Input.Wrapper
                    label="No. Kartu"
                    styles={{
                      label: { marginBottom: '5px' }
                    }}
                    mb={15}
                  >
                    <Input
                      size="md"
                      radius="md"
                      placeholder=""
                      name="nokartu"
                      value={noKartuInput}
                      onChange={(e) => setNoKartuInput(e.target.value)}
                    />
                  </Input.Wrapper>
                </form>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="Nama Karyawan"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    readOnly
                    variant="filled"
                    name="nama"
                    value={formData.nama}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="Nama Perusahaan"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    readOnly
                    variant="filled"
                    name="phone"
                    value={formData.namaprsh}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6} py={0}>
                <Input.Wrapper
                  label="No. KTP"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    readOnly
                    variant="filled"
                    name="noktp"
                    value={formData.noktp}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6} py={0}>
                <Input.Wrapper
                  label="Jenis Kelamin"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    readOnly
                    variant="filled"
                    name="jeniskelamin"
                    value={formData.jeniskelamin}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6} py={0}>
                <Input.Wrapper
                  label="No. Telp"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    readOnly
                    variant="filled"
                    name="telp"
                    value={formData.telp}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6} py={0}>
                <Input.Wrapper
                  label="Email"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    readOnly
                    variant="filled"
                    name="email"
                    value={formData.email}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="Masa Aktif"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    readOnly
                    variant="filled"
                    name="jeniskelamin"
                    value={formData.masaaktif}
                  />
                </Input.Wrapper>
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>
        {/* COL FOR IMG */}
        <Grid.Col span={5}>
          <Paper shadow="lg" radius="lg" p={20} h={'85vh'}>
            {capturedImage ? (
              <Box
                style={{ border: '2px dashed gray', borderRadius: '8px', overflow: 'hidden' }}
                onClick={open}
              >
                <AspectRatio ratio={1 / 1}>
                  <img
                    src={capturedImage}
                    alt="Captured"
                    style={{ width: '100%', height: '100%' }}
                  />
                </AspectRatio>
              </Box>
            ) : (
              <AspectRatio ratio={1 / 1}>
                <Box
                  style={{ border: '2px dashed gray', borderRadius: '8px' }}
                  bg={'gray.1'}
                  c={'gray'}
                  onClick={open}
                >
                  <Flex h="100%" w="100%" direction="column" justify="center" align="center">
                    <Center>
                      <MdOutlinePhotoCameraFront style={{ fontSize: '10rem' }} />
                    </Center>
                    <Center>
                      <Text fw={500}>CAPTURE FACE OF THE VISITOR</Text>
                    </Center>
                  </Flex>
                </Box>
              </AspectRatio>
            )}
            <Flex justify={'flex-end'} mt={25}>
              <Button radius="md" size="md" mt={10} w={'50%'} onClick={handleSubmit}>
                SUBMIT DATA
              </Button>
            </Flex>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* MODAL CAPTURE */}
      <Modal
        opened={opened}
        radius={'md'}
        onClose={close}
        size={'55rem'}
        title="Capture Face Of Visitor"
        centered
        style={{
          maxWidth: '90vw',
          maxHeight: '80vh'
        }}
      >
        <Box>
          {capturedImage ? (
            <Flex justify={'center'}>
              <img
                ref={cropperRef}
                src={capturedImage}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </Flex>
          ) : (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 1280,
                height: 720
              }}
              style={{ width: '100%', height: '100%', borderRadius: '8px' }}
            />
          )}
          <Flex mt={20} gap={10}>
            <Button w={'50%'} size="md" radius={'md'} variant="outline" onClick={retakePhoto}>
              RETAKE
            </Button>
            {capturedImage && cropper && !cropStatus ? (
              <Button w={'50%'} size="md" radius={'md'} onClick={handleCrop}>
                CROP
              </Button>
            ) : (
              <Button
                w={'50%'}
                size="md"
                radius={'md'}
                onClick={capturePhoto}
                disabled={capturedImage !== null}
              >
                CAPTURE
              </Button>
            )}
          </Flex>
        </Box>
      </Modal>
    </>
  )
}
