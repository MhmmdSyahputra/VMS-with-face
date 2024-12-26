import { useState, useEffect } from 'react'

export function NavbarMinimal(): JSX.Element {
  const [commandResult, setCommandResult] = useState<string>('')

  const ipcHandle = (): void => {
    window.electron.ipcRenderer.send('get-deviceID')
  }

  useEffect(() => {
    const handleResponse = (_: Electron.IpcRendererEvent, data: string): void => {
      setCommandResult(data.replace('UUID', '').trim())
    }

    window.electron.ipcRenderer.on('uuid-response', handleResponse)
  }, [])

  return (
    <>
      <div className="row">
        <div className="col">
          <button className="btn btn-primary" onClick={() => ipcHandle()}>
            Get Command
          </button>
          <p>Command Result:</p>
          <pre>{commandResult || 'No result yet...'}</pre> {/* Tampilkan hasil UUID */}
        </div>
      </div>
    </>
  )
}
