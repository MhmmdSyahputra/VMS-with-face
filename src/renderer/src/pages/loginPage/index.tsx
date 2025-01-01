import React from 'react'
import { Button, Center, Paper, PasswordInput, TextInput, Title } from '@mantine/core'
import classes from './login.module.css'
import { useNavigate } from 'react-router-dom'
import Logo from '@assets/icon.png'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const handleLogin = (): void => {
    navigate('/')
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
          />
          <Button
            fullWidth
            mt="xl"
            radius="md"
            size="md"
            style={{ fontSize: '1rem' }}
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        </div>
      </Paper>
    </div>
  )
}
