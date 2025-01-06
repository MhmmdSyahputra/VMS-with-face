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
import { NavbarMinimal } from './pages/testing'
import { MantineProvider } from '@mantine/core'
import { Titlebar } from './components/titleBar'
import { Notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
  return (
    <Router>
      <MantineProvider>
        <Notifications />
        <Titlebar />
        <MainLayout />
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
        <Route path="/" element={<HomePage />} />
        <Route path="/visitor/add" element={<AddVisitorPage />} />
        <Route path="/visitor" element={<VisitorPage />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/employee/add" element={<AddEmployeePage />} />
        <Route path="/tes" element={<NavbarMinimal />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Sidebar>
  )
}

export default App
