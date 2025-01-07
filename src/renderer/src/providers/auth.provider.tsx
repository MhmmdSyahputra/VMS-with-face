import { createContext, useContext, useState, ReactNode } from 'react'

// Definisi tipe untuk konteks
interface AppContextType {
  statusLogin: boolean
  updateStatuslogin: (newValue: boolean) => void
  namaUser: string
  updateNamaUser: (newValue: string) => void
  userId: string
  updateUserId: (newValue: string) => void
}

// Inisialisasi context dengan nilai default
const AppContext = createContext<AppContextType | undefined>(undefined)

// Custom hook untuk menggunakan konteks
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useUserLogin = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useUserLogin must be used within a UserLogin provider')
  }
  return context
}

// Komponen penyedia (provider)
interface UserLoginProps {
  children: ReactNode
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const UserLogin = ({ children }: UserLoginProps) => {
  const [statusLogin, setStatusLogin] = useState<boolean>(false)
  const updateStatuslogin = (newValue: boolean): void => {
    setStatusLogin(newValue)
  }

  const [namaUser, setNamaUser] = useState<string>('')
  const updateNamaUser = (newValue: string): void => {
    setNamaUser(newValue)
  }

  const [userId, setUserId] = useState<string>('')
  const updateUserId = (newValue: string): void => {
    setUserId(newValue)
  }

  return (
    <AppContext.Provider
      value={{
        statusLogin,
        updateStatuslogin,
        namaUser,
        updateNamaUser,
        userId,
        updateUserId
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
