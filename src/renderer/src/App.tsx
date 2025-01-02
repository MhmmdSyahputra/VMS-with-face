import { Sidebar } from './components/sideBar/sidebar'
import { AddEmployeePage, AddVisitorPage, EmployeePage, HomePage, LoginPage } from './pages'
import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { NavbarMinimal } from './pages/testing'
import { MantineProvider } from '@mantine/core'
import { Titlebar } from './components/titleBar'
import { Notifications } from '@mantine/notifications'

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
  const excludePathsWithoutSidebar = [/^\/login$/i]
  const isSidebarExcluded = excludePathsWithoutSidebar.some((pattern) =>
    pattern.test(location.pathname)
  )

  return isSidebarExcluded ? (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  ) : (
    <Sidebar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visitor/add" element={<AddVisitorPage />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/employee/add" element={<AddEmployeePage />} />
        <Route path="/tes" element={<NavbarMinimal />} />
      </Routes>
    </Sidebar>
  )
}

export default App
