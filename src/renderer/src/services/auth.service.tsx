import { IPayloadLogin, IResponseLogin } from '@renderer/interface/auth.interface'
import axios, { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import useCookie from 'react-use-cookie'

interface AuthService {
  authLogin: (data: IPayloadLogin) => Promise<IResponseLogin>
  logout: () => void
}

const AuthService = (): AuthService => {
  const dataConfig = localStorage.getItem('dataConfig')
  const navigate = useNavigate()
  const apiUrl = JSON.parse(dataConfig!).baseURL
  const secretCode = JSON.parse(dataConfig!).secretCode
  const [, setCookieLogin] = useCookie('userLoginCookie', '')

  const authLogin = async (data: IPayloadLogin): Promise<IResponseLogin> => {
    try {
      const response: AxiosResponse<IResponseLogin> = await axios.post(
        `${apiUrl}?secretkey=${secretCode}&tipe=userLogin`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const logout = (): void => {
    setCookieLogin('')
    navigate('/login')
  }

  return {
    authLogin,
    logout
  }
}

export default AuthService
