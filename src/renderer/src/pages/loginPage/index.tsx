import React, { useRef, useState } from 'react'
import { Button, Center, Paper, PasswordInput, TextInput, Title } from '@mantine/core'
import classes from './login.module.css'
import { useNavigate } from 'react-router-dom'
import Logo from '@assets/icon.png'
import useCookie from 'react-use-cookie'
import { notifications } from '@mantine/notifications'
import AuthService from '@renderer/services/auth.service'
import { IPayloadLogin } from '@renderer/interface/auth.interface'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const authService = AuthService()
  const inputRefs = Array.from({ length: 2 }, () => useRef<HTMLInputElement>(null))
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [formLogin, setFormLogin] = useState<IPayloadLogin>({
    userid: '',
    passuser: ''
  })
  const [errorDataLogin, setErrorDataConfig] = useState<{ [key: string]: string }>({})
  const [loadingFormLogin, setloadingFormLogin] = useState(false)
  const [, setCookieLogin] = useCookie('userLoginCookie', '')

  const handleNextInput = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>,
    index: number
  ): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (index < inputRefs.length - 1 && inputRefs[index + 1].current) {
        inputRefs[index + 1].current?.focus()
      } else if (index === inputRefs.length - 1 && buttonRef.current) {
        buttonRef.current.focus()
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormLogin((prevState) => ({
      ...prevState,
      [name]: value.toUpperCase()
    }))
    setErrorDataConfig((prevErrors) => ({ ...prevErrors, [name]: '' }))
  }

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}
    if (!formLogin.userid) errors.userid = 'UserId masih kosong!'
    if (!formLogin.passuser) errors.passuser = 'Password user masih kosong!'

    setErrorDataConfig(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) {
      console.log('Form submitted:', formLogin)
      return
    }
    setloadingFormLogin(true)
    try {
      const response = await authService.authLogin(formLogin)
      if (response.valid === 1) {
        const userData = {
          namauser: response.namauser,
          userid: response.userid
        }
        setCookieLogin(JSON.stringify(userData), { days: 1 })
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
      setloadingFormLogin(false)
      navigate('/')
    }
  }

  return (
    <div className={classes.wrapper}>
      <Paper
        className={classes.form}
        radius={0}
        p={30}
        display={'flex'}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <div className="w-100" style={{ marginBottom: '250px' }}>
          <Center>
            <img src={Logo} alt="" width={70} />
          </Center>
          <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
            WELCOME TO VMSYSTEM!
          </Title>
          <TextInput
            label="USERID"
            styles={{
              label: { marginBottom: '5px', fontSize: '1rem', fontWeight: '600' }
            }}
            size="md"
            radius="md"
            placeholder=""
            mt="md"
            name="userid"
            value={formLogin.userid}
            onChange={handleChange}
            error={errorDataLogin.userid}
            onKeyDown={(event) => handleNextInput(event, 0)}
            ref={inputRefs[0]}
            tabIndex={1}
          />
          <PasswordInput
            label="PASSWORD"
            styles={{
              label: { marginBottom: '5px', fontSize: '1rem', fontWeight: '600' }
            }}
            size="md"
            radius="md"
            placeholder=""
            mt="md"
            name="passuser"
            value={formLogin.passuser}
            onChange={handleChange}
            error={errorDataLogin.passuser}
            onKeyDown={(event) => handleNextInput(event, 1)}
            ref={inputRefs[1]}
            tabIndex={2}
          />
          <Button
            fullWidth
            ref={buttonRef}
            tabIndex={3}
            mt="xl"
            radius="md"
            size="md"
            style={{ fontSize: '1rem' }}
            onClick={handleLogin}
            loading={loadingFormLogin}
          >
            LOGIN
          </Button>
        </div>
      </Paper>
    </div>
  )
}
