import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useCookie from 'react-use-cookie'

interface PrivateRouteProps {
  Component: React.ComponentType
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ Component }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [cookieLogin] = useCookie('userLoginCookie')
  const userLoginCookie = cookieLogin ? JSON.parse(cookieLogin) : null

  useEffect(() => {
    const checkToken = async (): Promise<void> => {
      if (userLoginCookie && userLoginCookie.token) {
        setIsValid(true)
      } else {
        setIsValid(false)
      }
    }

    checkToken()
  }, [userLoginCookie])

  if (isValid === null) {
    return <div></div>
  }

  return isValid ? <Component /> : <Navigate to="/login" />
}

export default PrivateRoute
