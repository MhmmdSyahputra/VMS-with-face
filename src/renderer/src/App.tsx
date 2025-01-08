import { Sidebar } from './components/sideBar/sidebar'
import {
  AddEmployeePage,
  AddVisitorPage,
  EmployeePage,
  HomePage,
  LoginPage,
  VisitorPage
} from './pages'
import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { Titlebar } from './components/titleBar'
import { Notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import PrivateRoute from './providers/privateRoute.provider'
import { ConfigProvider } from './providers/config.provider'
import useCookie from 'react-use-cookie'

function App(): JSX.Element {
  const [, setCookieLogin] = useCookie('userLoginCookie', '')

  useEffect(() => {
    setCookieLogin('')
  }, [])

  window.addEventListener('keydown', (e) => {
    const { key, altKey } = e
    //disable alt+f4 for close
    if (key === 'F4' && altKey) {
      e.preventDefault()
    }
    if (key === 'w' && e.ctrlKey) {
      e.preventDefault()
    }
    //disable f for taskbar
    if (key === 'f' && altKey) {
      e.preventDefault()
    }
    //disable F12 for minimize
    if (key === 'F11') {
      e.preventDefault()
    }

    if (key == 'r' && e.ctrlKey) {
      e.preventDefault()
      window.location.reload()
    }
  })
  return (
    <Router>
      <MantineProvider>
        <Notifications />
        <Titlebar />
        <ConfigProvider>
          <MainLayout />
        </ConfigProvider>
      </MantineProvider>
    </Router>
  )
}

function MainLayout(): JSX.Element {
  const location = useLocation()
  const [loading, setLoading] = useState<boolean>(true)

  const excludePathsWithoutSidebar = [/^\/login$/i]
  const isSidebarExcluded = excludePathsWithoutSidebar.some((pattern) =>
    pattern.test(location.pathname)
  )

  useEffect(() => {
    const configKey = 'dataConfig'
    const existingConfig = localStorage.getItem(configKey)

    if (!existingConfig) {
      const defaultConfig = {
        licenseKey: '1122334455',
        baseURL: 'http://103.120.169.151/sysgate_office/_api/api-vms.php',
        secretCode: '1122334455667788',
        idKiosk: 'K01'
      }
      localStorage.setItem(configKey, JSON.stringify(defaultConfig))
      window.location.reload()
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Loading...</div> // Replace this with a proper loading spinner if needed
  }

  return isSidebarExcluded ? <LoginRoutes /> : <SidebarLayout />
}

function LoginRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  )
}

function SidebarLayout(): JSX.Element {
  return (
    <Sidebar>
      <Routes>
        <Route path="/" element={<PrivateRoute Component={HomePage} />} />
        <Route path="/visitor/add" element={<PrivateRoute Component={AddVisitorPage} />} />
        <Route path="/visitor" element={<PrivateRoute Component={VisitorPage} />} />
        <Route path="/employee" element={<PrivateRoute Component={EmployeePage} />} />
        <Route path="/employee/detail/:id" element={<PrivateRoute Component={AddEmployeePage} />} />
        <Route path="*" element={<div>Page Not Found</div>} />

        {/* <Route path="/" element={<HomePage />} />
          <Route path="/visitor/add" element={<AddVisitorPage />} />
          <Route path="/visitor" element={<VisitorPage />} />
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/employee/detail/:id" element={<AddEmployeePage />} />
          <Route path="*" element={<div>Page Not Found</div>} /> */}
      </Routes>
    </Sidebar>
  )
}

export default App
