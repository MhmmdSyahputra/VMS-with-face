import { IResponseAddVisitor } from '@renderer/interface/visitor.interface'
import axios, { AxiosResponse } from 'axios'

interface VisitorService {
  addVisitor: (data: FormData) => Promise<IResponseAddVisitor>
}

const VisitorService = (): VisitorService => {
  const dataConfig = localStorage.getItem('dataConfig')
  const apiUrl = JSON.parse(dataConfig!).baseURL
  const secretCode = JSON.parse(dataConfig!).secretCode

  const addVisitor = async (data: FormData): Promise<IResponseAddVisitor> => {
    try {
      const response: AxiosResponse<IResponseAddVisitor> = await axios.post(
        `${apiUrl}?secretkey=${secretCode}&tipe=submitDataPengunjung`,
        { data }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    addVisitor
  }
}

export default VisitorService
