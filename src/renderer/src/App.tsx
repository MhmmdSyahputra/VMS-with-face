import { Sidebar } from './components/sideBar/sidebar'
import { AddVisitorPage, EmployeePage, HomePage } from './pages'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { NavbarMinimal } from './pages/testing'
import { MantineProvider } from '@mantine/core'
import { Titlebar } from './components/titleBar'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <Router>
        <MantineProvider>
          <Titlebar />
          <Sidebar>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/visitor/add" element={<AddVisitorPage />} />
              <Route path="/employee" element={<EmployeePage />} />
              <Route path="/tes" element={<NavbarMinimal />} />
            </Routes>
          </Sidebar>
        </MantineProvider>
      </Router>
    </>
  )
}

export default App
