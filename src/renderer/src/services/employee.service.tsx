import { IGetDetailEmplooye } from '@renderer/interface/employee.interface'
import axios, { AxiosResponse } from 'axios'

interface EmployeeService {
  getDetailEmployee: (kode: string) => Promise<IGetDetailEmplooye>
}

const EmployeeService = (): EmployeeService => {
  const dataConfig = localStorage.getItem('dataConfig')
  const apiUrl = JSON.parse(dataConfig!).baseURL
  const secretCode = JSON.parse(dataConfig!).secretCode

  const getDetailEmployee = async (kode: string): Promise<IGetDetailEmplooye> => {
    try {
      const response: AxiosResponse<IGetDetailEmplooye> = await axios.post(
        `${apiUrl}?secretkey=${secretCode}&tipe=checkDataMember`,
        { nokartu: kode }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getDetailEmployee
  }
}

export default EmployeeService
