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

interface FormData {
  name: string
  phone: string
  email: string
  gender: string
  com_visit: string
  dest: string
}

export const AddVisitorPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    gender: 'MALE',
    com_visit: '',
    dest: ''
  })
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

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}
    if (!formData.name) errors.name = 'Full name is required'
    if (!formData.phone) errors.phone = 'Phone number is required'
    if (!formData.email) errors.email = 'Email is required'
    if (!formData.dest) errors.dest = 'Destination is required'

    setErrorDataConfig(errors)
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
      <Grid grow gutter="xl" h={'85vh'}>
        <Grid.Col span={6}>
          <Paper shadow="lg" radius="lg" p={20} h={'85vh'}>
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
            <Input.Wrapper
              label="DESTINATION"
              withAsterisk
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
                name="dest"
                value={formData.dest}
                onChange={handleInputChange}
              />
            </Input.Wrapper>
          </Paper>
        </Grid.Col>
        <Grid.Col span={6}>
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
              <Box
                style={{ border: '2px dashed gray', borderRadius: '8px' }}
                bg={'gray.1'}
                h={'60vh'}
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
