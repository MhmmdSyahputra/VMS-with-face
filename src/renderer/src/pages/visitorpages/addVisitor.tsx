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
import 'cropperjs/dist/cropper.css'
import ConfigService from '@renderer/services/config.service'
import { IDataConfig } from '@renderer/interface/config.interface'
import axios from 'axios'
import VisitorService from '@renderer/services/visitor.service'
import { notifications } from '@mantine/notifications'
import { cekWaktu } from '@renderer/utils/myFunction'
import { useNavigate } from 'react-router-dom'

interface FormData {
  nama: string
  telp: string
  tanggal: string
  email: string
  sex: string
  prshvisitor: string
  nokartuakses: string
  comp_visit: string
  cp: string
}

export const AddVisitorPage: React.FC = () => {
  const navigate = useNavigate()
  const configService = ConfigService()
  const visitorService = VisitorService()
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    telp: '',
    tanggal: '',
    email: '',
    sex: '1',
    prshvisitor: '',
    nokartuakses: '',
    comp_visit: '',
    cp: ''
  })
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [dataDestination, setDataDestination] = useState<{ label: string; value: string }[]>([])
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)

  const [dataSex] = useState<{ label: string; value: string }[]>([
    { label: 'Laki-laki', value: '1' },
    { label: 'Prempuan', value: '0' }
  ])
  const [selectedSex, setSelectedSex] = useState<string | null>('1')

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
  const [capturedImages, setCapturedImages] = useState<(string | null)[]>([null, null, null])
  const [cropStatuses, setCropStatuses] = useState<boolean[]>([false, false, false])
  const webcamRef = useRef<Webcam>(null)
  const cropperRefs = useRef<(HTMLImageElement | null)[]>([null, null, null])
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)

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
    if (!formData.nama) errors.nama = 'Full name is required'
    if (!formData.telp) errors.telp = 'Phone number is required'
    if (!formData.sex) errors.sex = 'Gender is required'
    if (!selectedDestination) errors.destination = 'Destination is required'
    if (!selectedReason) errors.reason = 'Reason is required'

    setErrorDataConfig(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      console.log('Form submitted:', formData)
      return
    }

    setLoadingSubmit(true)
    const getConfig = localStorage.getItem('dataConfig')
    const dataConfig: IDataConfig = JSON.parse(getConfig!)

    const payloadData = new FormData()
    for (let i = 0; i < capturedImages.length; i++) {
      const image = capturedImages[i]
      if (image !== null) {
        try {
          const response = await axios.get(image, { responseType: 'blob' })
          const blob = response.data
          const file = new File([blob], `foto${i + 1}.jpg`)
          payloadData.append(`foto${i + 1}`, file)
        } catch {
          payloadData.append(`foto${i + 1}`, '')
        }
      }
    }

    payloadData.append('idkiosk', dataConfig.idKiosk)
    payloadData.append('userid', '')
    payloadData.append('tanggal', formData.tanggal!)
    payloadData.append('nama', formData.nama)
    payloadData.append('telp', formData.telp)
    payloadData.append('email', formData.email)
    payloadData.append('sex', selectedSex!)
    payloadData.append('prshvisitor', formData.prshvisitor)
    payloadData.append('idprsh', selectedDestination!.split(';')[0]!)
    payloadData.append('namaprsh', selectedDestination!.split(';')[1]!)
    payloadData.append('idlantai', selectedDestination!.split(';')[2]!)
    payloadData.append('namalantai', selectedDestination!.split(';')[3]!)
    payloadData.append('cp', formData.cp)
    payloadData.append('no', formData.nokartuakses)
    payloadData.append('idalasan', selectedReason!)
    payloadData.append('namaalasan', '')
    payloadData.append('idakses', selectedTypeAccess!)
    payloadData.append('nokartuakses', formData.nokartuakses)
    payloadData.append('tipekunjungan', selectedTypeVisit!)
    payloadData.append('waktuakhir', selectedTimeEnd!)

    try {
      const response = await visitorService.addVisitor(payloadData)

      // if (response.msgtext && response.msgtext.length > 0) {
      //   notifications.show({
      //     color: 'green',
      //     position: 'top-right',
      //     title: 'Berhasil',
      //     message: `${response.msgtext}`
      //   })
      // }

      if (response.valid === 1) {
        if (selectedTypeAccess !== '0') {
          const dataToprint = {
            header1: 'header1',
            header2: 'header2',
            codeAPI: response.kodetiket,
            fullName: formData.nama,
            idNumber: formData.nokartuakses,
            destination: selectedDestination!.split(';')[1]!,
            lantai: selectedDestination!.split(';')[3]!,
            footer1: 'footer1',
            footer2: 'footer2'
          }
          window.electron.ipcRenderer.send('print-entrance-ticket', dataToprint)
        }

        notifications.show({
          color: 'green',
          position: 'top-right',
          title: 'Berhasil',
          message: `${response.msgtext}`
        })
        navigate('/')
      } else {
        notifications.show({
          color: 'red',
          position: 'top-right',
          title: 'Gagal',
          message: `${response.msgtext}`
        })
      }
    } catch (error) {
      notifications.show({
        color: 'red',
        position: 'top-right',
        title: 'Gagal',
        message: `Terjadi kesalahan pada server!`
      })
    } finally {
      setLoadingSubmit(false)
    }
  }

  const capturePhoto = (): void => {
    if (webcamRef.current !== null && currentImageIndex !== null) {
      const imageSrc = webcamRef.current.getScreenshot()
      const newImages = [...capturedImages]
      newImages[currentImageIndex] = imageSrc
      setCapturedImages(newImages)
      open()
    }
  }

  const retakePhoto = (): void => {
    if (currentImageIndex !== null) {
      const newImages = [...capturedImages]
      newImages[currentImageIndex] = null
      setCapturedImages(newImages)
      const newStatuses = [...cropStatuses]
      newStatuses[currentImageIndex] = false
      setCropStatuses(newStatuses)
      open()
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
        value: `${item.idprsh};${item.namaprsh};${item.idlantai};${item.namalantai}`
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

  const getDate = async (): Promise<void> => {
    try {
      const response = await configService.getDate()
      setFormData({ ...formData, tanggal: response.tanggal.split(' ')[0] })
    } catch (error) {
      console.error(error)
    }
  }

  const checkIDCard = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    try {
      const response = await visitorService.checkIDCardAkses(formData.nokartuakses)
      console.log(response)
      if (response.valid != 1) {
        notifications.show({
          color: 'red',
          position: 'top-right',
          title: 'Gagal',
          message: `${response.msgtext}`
        })
        setFormData({ ...formData, nokartuakses: '' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDestination()
    getReason()
    getTypeAccess()
    getTimeEnd()
    getDate()
  }, [])

  return (
    <>
      <Grid grow gutter="md" h={'100vh'}>
        <Grid.Col span={4} h={'90vh'}>
          <Paper shadow="lg" radius="lg" p={20} h="100%">
            <Grid>
              <Grid.Col span={12} pb={0}>
                <Input.Wrapper
                  label="FULL NAME"
                  withAsterisk
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.nama}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    name="nama"
                    value={formData.nama}
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
                  error={errorDataConfig.telp}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    name="telp"
                    value={formData.telp}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault()
                      }
                      if (event.key === ' ') {
                        event.preventDefault()
                      }
                    }}
                    onChange={handleInputChange}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="E-MAIL"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
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
                    allowDeselect={false}
                    size="md"
                    radius="md"
                    placeholder="Pick value"
                    data={dataSex}
                    value={selectedSex}
                    name="sex"
                    // value={formData.sex}
                    onChange={(value) => setSelectedSex(value)}
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
                    name="comp_visit"
                    value={formData.comp_visit}
                    onChange={handleInputChange}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="DESTINATION"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.destination}
                  mb={15}
                >
                  <Select
                    allowDeselect={false}
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
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  mb={15}
                >
                  <Input
                    size="md"
                    radius="md"
                    placeholder=""
                    name="cp"
                    value={formData.cp}
                    onChange={handleInputChange}
                  />
                </Input.Wrapper>
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="lg" radius="lg" p={20} h={'100%'}>
            {[0, 1, 2].map((index) => (
              <Box mb={20} key={index}>
                {capturedImages[index] ? (
                  <Box
                    style={{ border: '2px dashed gray', borderRadius: '8px', overflow: 'hidden' }}
                    onClick={() => {
                      setCurrentImageIndex(index)
                      open()
                    }}
                  >
                    <AspectRatio ratio={2 / 1}>
                      <img
                        src={capturedImages[index]}
                        alt={`Captured ${index + 1}`}
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
                      onClick={() => {
                        if (index > 0 && !capturedImages[index - 1]) {
                          return notifications.show({
                            color: 'red',
                            position: 'top-right',
                            title: '',
                            message: `Harap Photo #${index} dahulu`
                          })
                        }
                        setCurrentImageIndex(index)
                        open()
                      }}
                    >
                      <Flex h="100%" w="100%" direction="column" justify="center" align="center">
                        <Center>
                          <MdOutlinePhotoCameraFront style={{ fontSize: '7rem' }} />
                        </Center>
                        <Center>
                          <Text fw={500}>Photo #{index + 1}</Text>
                        </Center>
                      </Flex>
                    </Box>
                  </AspectRatio>
                )}
              </Box>
            ))}
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="lg" radius="lg" p={20} h={'100%'}>
            <Grid>
              <Grid.Col span={12} py={0}>
                <Input.Wrapper
                  label="Reason of Visiting"
                  styles={{
                    label: { marginBottom: '5px' }
                  }}
                  error={errorDataConfig.reason}
                  mb={15}
                >
                  <Select
                    allowDeselect={false}
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
                    allowDeselect={false}
                    size="md"
                    radius="md"
                    placeholder="Pick value"
                    data={dataTypeAccess}
                    value={selectedTypeAccess}
                    onChange={(value) => {
                      setSelectedTypeAccess(value)
                      setFormData({ ...formData, nokartuakses: '' })
                    }}
                  />
                </Input.Wrapper>
              </Grid.Col>
              <Grid.Col span={6} py={0}>
                <form onSubmit={checkIDCard}>
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
                      name="nokartuakses"
                      value={formData.nokartuakses}
                      onChange={handleInputChange}
                    />
                  </Input.Wrapper>
                </form>
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
                    allowDeselect={false}
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
                    allowDeselect={false}
                    size="md"
                    radius="md"
                    placeholder="Pick value"
                    disabled={selectedTypeVisit === '0' ? true : false}
                    data={dataTimeEnd}
                    value={selectedTimeEnd}
                    onChange={(value) => {
                      if (cekWaktu(value!) === false) {
                        notifications.show({
                          color: 'red',
                          position: 'top-right',
                          title: '',
                          message: `Please check the ending time of your chosen visit`
                        })
                      }
                      setSelectedTimeEnd(value)
                    }}
                  />
                </Input.Wrapper>
              </Grid.Col>
            </Grid>
            <Grid.Col span={12} className="text-end" p={0}>
              <Button
                radius="md"
                size="md"
                mt={20}
                w={'100%'}
                loading={loadingSubmit}
                loaderProps={{ type: 'dots' }}
                onClick={handleSubmit}
              >
                SUBMIT DATA
              </Button>
            </Grid.Col>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* MODAL CAPTURE */}
      <Modal
        opened={opened}
        radius={'md'}
        onClose={close}
        size={'55rem'}
        title={`Photo #${currentImageIndex !== null ? currentImageIndex + 1 : ''}`}
        centered
        style={{ maxWidth: '90vw', maxHeight: '80vh' }}
      >
        <Box>
          {currentImageIndex !== null && capturedImages[currentImageIndex] ? (
            <Flex justify={'center'}>
              <img
                ref={(el) => (cropperRefs.current[currentImageIndex] = el)}
                src={capturedImages[currentImageIndex]!}
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
            {currentImageIndex !== null && capturedImages[currentImageIndex] !== null ? (
              <Button w={'50%'} size="md" radius={'md'} onClick={close}>
                SELESAI
              </Button>
            ) : (
              <Button
                w={'50%'}
                size="md"
                radius={'md'}
                onClick={capturePhoto}
                // disabled={currentImageIndex !== null && capturedImages[currentImageIndex] !== null}
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
