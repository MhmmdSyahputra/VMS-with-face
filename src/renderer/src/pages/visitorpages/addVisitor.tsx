import {
  Grid,
  Input,
  Paper,
  Select,
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
import ConfigService from '@renderer/services/config.service'

interface FormData {
  name: string
  phone: string
  email: string
  gender: string
  com_visit: string
  dest: string
}

export const AddVisitorPage: React.FC = () => {
  const configService = ConfigService()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    gender: 'MALE',
    com_visit: '',
    dest: ''
  })
  const [dataDestination, setDataDestination] = useState<{ label: string; value: string }[]>([])
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)

  const [dataReason, setDataReason] = useState<{ label: string; value: string }[]>([])
  const [selectedReason, setSelectedReason] = useState<string | null>(null)

  const [dataTypeAccess, setDataTypeAccess] = useState<{ label: string; value: string }[]>([])
  const [selectedTypeAccess, setSelectedTypeAccess] = useState<string | null>(null)

  const [dataTypeVisit] = useState<{ label: string; value: string }[]>([
    {
      value: '0',
      label: 'One Pass'
    },
    {
      value: '1',
      label: 'Limited Hours'
    }
  ])
  const [selectedTypeVisit, setSelectedTypeVisit] = useState<string | null>(dataTypeVisit[0].value)

  const [dataTimeEnd, setDataTimeEnd] = useState<{ label: string; value: string }[]>([])
  const [selectedTimeEnd, setSelectedTimeEnd] = useState<string | null>(null)

  const [errorDataConfig, setErrorDataConfig] = useState<{ [key: string]: string }>({})
  const [opened, { open, close }] = useDisclosure(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cropper, setCropper] = useState<Cropper | null>(null)
  const [cropStatus, setCropperStatus] = useState<boolean>(false)
  const webcamRef = useRef<Webcam>(null)
  const cropperRef = useRef<HTMLImageElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
    setErrorDataConfig((prevErrors) => ({ ...prevErrors, [name]: '' }))
  }

  const handleSubmit = (): void => {
    console.log('submit')
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

  const getTypeAccess = async (): Promise<void> => {
    try {
      const response = await configService.getTypeAccess()
      const transformedData = response.map((item) => ({
        label: `${item.namatipeakses}`,
        value: `${item.idtipeakses}`
      }))

      setSelectedTypeAccess(transformedData[0].value)
      setDataTypeAccess(transformedData)
    } catch (error) {
      console.log(error)
    }
  }

  const getReason = async (): Promise<void> => {
    try {
      const response = await configService.getReason()
      const transformedData = response.map((item) => ({
        label: `${item.namaalasan}`,
        value: `${item.idalasan}`
      }))

      setSelectedReason(transformedData[0].value)
      setDataReason(transformedData)
    } catch (error) {
      console.log(error)
    }
  }
  const getDestination = async (): Promise<void> => {
    try {
      const response = await configService.getDestination()
      const transformedData = response.map((item) => ({
        label: `${item.namaprsh} ${item.namalantai}`,
        value: `${item.idprsh};${item.idlantai}`
      }))

      setSelectedDestination(transformedData[0].value)
      setDataDestination(transformedData)
    } catch (error) {
      console.log(error)
    }
  }

  const getTimeEnd = async (): Promise<void> => {
    try {
      const response = await configService.getListTime()
      const transformedData = response.map((item) => ({
        label: `${item.jam}`,
        value: `${item.jam}`
      }))

      setSelectedTimeEnd(transformedData[0].value)
      setDataTimeEnd(transformedData)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDestination()
    getReason()
    getTypeAccess()
    getTimeEnd()
  }, [])

  return (
    <>
      <Grid grow gutter="xl" h={'100vh'}>
        <Grid.Col span={4}>
          <Paper shadow="lg" radius="lg" p={20} h={'85vh'}>
            <Grid>
              <Grid.Col span={12} pb={0}>
                <Input.Wrapper
                  label="FULL NAME"
                  withAsterisk
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.name}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="PHONE NUMBER"
                  withAsterisk
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.phone}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="E-MAIL"
                  withAsterisk
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.email}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="GENDER"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  mb={15}
                >
                  <Select
                    size="md"
                    radius="md"
                    placeholder="Pick value"
                    data={['MALE', 'FEMALE']}
                    name="gender"
                    value={formData.gender}
                    onChange={(value) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        gender: value || 'MALE'
                      }))
                    }
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="COMPANY OF VISITOR"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    name="com_visit"
                    value={formData.com_visit}
                    onChange={handleInputChange}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="DESTINATION"
                  withAsterisk
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.dest}
                  mb={15}
                >
                  <Select
                    size="md"
                    radius="md"
                    placeholder="Pick value"
                    data={dataDestination}
                    value={selectedDestination}
                    onChange={(value) => setSelectedDestination(value)}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="CONTACT PERSON"
                  withAsterisk
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.phone}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Input.Wrapper>
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="lg" radius="lg" p={20} h={'85vh'}>
            {/* CAMERA 1 */}
            <Box mb={20}>
              {capturedImage ? (
                <Box
                  style={{ border: '2px dashed gray', borderRadius: '8px', overflow: 'hidden' }}
                  onClick={open}
                >
                  <AspectRatio ratio={2 / 1}>
                    <img
                      src={capturedImage}
                      alt="Captured"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </AspectRatio>
                </Box>
              ) : (
                <AspectRatio ratio={2 / 1}>
                  <Box
                    style={{ border: '2px dashed gray', borderRadius: '8px' }}
                    bg={'gray.1'}
                    c={'gray'}
                    onClick={open}
                  >
                    <Flex h="100%" w="100%" direction="column" justify="center" align="center">
                      <Center>
                        <MdOutlinePhotoCameraFront style={{ fontSize: '7rem' }} />
                      </Center>
                      <Center>
                        <Text fw={500}>CAPTURE FACE OF THE VISITOR</Text>
                      </Center>
                    </Flex>
                  </Box>
                </AspectRatio>
              )}
            </Box>
            {/* CAMERA 2 */}
            <Box mb={20}>
              {capturedImage ? (
                <Box
                  style={{ border: '2px dashed gray', borderRadius: '8px', overflow: 'hidden' }}
                  onClick={open}
                >
                  <AspectRatio ratio={2 / 1}>
                    <img
                      src={capturedImage}
                      alt="Captured"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </AspectRatio>
                </Box>
              ) : (
                <AspectRatio ratio={2 / 1}>
                  <Box
                    style={{ border: '2px dashed gray', borderRadius: '8px' }}
                    bg={'gray.1'}
                    c={'gray'}
                    onClick={open}
                  >
                    <Flex h="100%" w="100%" direction="column" justify="center" align="center">
                      <Center>
                        <MdOutlinePhotoCameraFront style={{ fontSize: '7rem' }} />
                      </Center>
                      <Center>
                        <Text fw={500}>CAPTURE FACE OF THE VISITOR</Text>
                      </Center>
                    </Flex>
                  </Box>
                </AspectRatio>
              )}
            </Box>
            {/* CAMERA 3 */}
            <Box mb={20}>
              {capturedImage ? (
                <Box
                  style={{ border: '2px dashed gray', borderRadius: '8px', overflow: 'hidden' }}
                  onClick={open}
                >
                  <AspectRatio ratio={2 / 1}>
                    <img
                      src={capturedImage}
                      alt="Captured"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </AspectRatio>
                </Box>
              ) : (
                <AspectRatio ratio={2 / 1}>
                  <Box
                    style={{ border: '2px dashed gray', borderRadius: '8px' }}
                    bg={'gray.1'}
                    c={'gray'}
                    onClick={open}
                  >
                    <Flex h="100%" w="100%" direction="column" justify="center" align="center">
                      <Center>
                        <MdOutlinePhotoCameraFront style={{ fontSize: '7rem' }} />
                      </Center>
                      <Center>
                        <Text fw={500}>CAPTURE FACE OF THE VISITOR</Text>
                      </Center>
                    </Flex>
                  </Box>
                </AspectRatio>
              )}
            </Box>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="lg" radius="lg" p={20} h={'85vh'}>
            <Grid>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="Reason of Visiting"
                  withAsterisk
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.dest}
                  mb={15}
                >
                  <Select
                    size="md"
                    radius="md"
                    placeholder="Pick value"
                    data={dataReason}
                    value={selectedReason}
                    onChange={(value) => setSelectedReason(value)}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6} py={0}>
                <Input.Wrapper
                  label="Type of Access"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.dest}
                  mb={15}
                >
                  <Select
                    size="md"
                    radius="md"
                    placeholder="Pick value"
                    data={dataTypeAccess}
                    value={selectedTypeAccess}
                    onChange={(value) => setSelectedTypeAccess(value)}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6} py={0}>
                <Input.Wrapper
                  label="UUID CARD"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.dest}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    disabled={selectedTypeAccess === '0' ? false : true}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6} py={0}>
                <Input.Wrapper
                  label="Type of Visit"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.dest}
                  mb={15}
                >
                  <Select
                    size="md"
                    radius="md"
                    placeholder="Pick value"
                    data={dataTypeVisit}
                    value={selectedTypeVisit}
                    onChange={(value) => setSelectedTypeVisit(value)}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6} py={0}>
                <Input.Wrapper
                  label="Time End"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.dest}
                  mb={15}
                >
                  <Select
                    size="md"
                    radius="md"
                    placeholder="Pick value"
                    disabled={selectedTypeVisit === '0' ? true : false}
                    data={dataTimeEnd}
                    value={selectedTimeEnd}
                    onChange={(value) => setSelectedTimeEnd(value)}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} pb={0}>
                <Input.Wrapper
                  label="Remake"
                  withAsterisk
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.name}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Input.Wrapper>
              </Grid.Col>
            </Grid>
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
