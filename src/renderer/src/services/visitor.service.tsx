import {
  IHistoryVisitor,
  IPayloadHistoryVisitor,
  IResponseAddVisitor,
  Visitor
} from '@renderer/interface/visitor.interface'
import axios, { AxiosResponse } from 'axios'
interface HeaderResponse {
  header: [string, string][]
}
interface VisitorService {
  addVisitor: (data: FormData) => Promise<IResponseAddVisitor>
  getHeaderTableVisitor: () => Promise<HeaderResponse>
  getDataVisitor: () => Promise<Visitor[]>
  historyDataVisitor: (data: IPayloadHistoryVisitor) => Promise<IHistoryVisitor[]>
  checkIDCardAkses: (id: string) => Promise<{ valid: number; msgtext: string }>
  // clearSessionVisitor: (id: string) => Promise<{ valid: number; msgtext: string }>
}

const VisitorService = (): VisitorService => {
  const dataConfig = localStorage.getItem('dataConfig')
  const apiUrl = JSON.parse(dataConfig!).baseURL
  const secretCode = JSON.parse(dataConfig!).secretCode

  const addVisitor = async (data: FormData): Promise<IResponseAddVisitor> => {
    try {
      const response: AxiosResponse<IResponseAddVisitor> = await axios.post(
        `${apiUrl}?secretkey=${secretCode}&tipe=submitDataPengunjung`,
        data,
        {
          timeout: 3000,
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getHeaderTableVisitor = async (): Promise<HeaderResponse> => {
    try {
      const response: AxiosResponse<HeaderResponse> = await axios.get(
        `${apiUrl}?secretkey=${secretCode}&tipe=headerListDataPengunjung`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDataVisitor = async (): Promise<Visitor[]> => {
    try {
      const response: AxiosResponse<Visitor[]> = await axios.get(
        `${apiUrl}?secretkey=${secretCode}&tipe=listDataPengunjung`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const historyDataVisitor = async (data: IPayloadHistoryVisitor): Promise<IHistoryVisitor[]> => {
    try {
      const response: AxiosResponse<IHistoryVisitor[]> = await axios.post(
        `${apiUrl}?secretkey=${secretCode}&tipe=riwayatPengunjung`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // const clearSessionVisitor = async (data: IPayloadHistoryVisitor): Promise<IHistoryVisitor[]> => {
  //   try {
  //     const response: AxiosResponse<IHistoryVisitor[]> = await axios.post(
  //       `${apiUrl}?secretkey=${secretCode}&tipe=clearSessionVisitor`,
  //       data
  //     )
  //     return response.data
  //   } catch (error) {
  //     console.error(error)
  //     throw error
  //   }
  // }

  const checkIDCardAkses = async (id: string): Promise<{ valid: number; msgtext: string }> => {
    try {
      const response: AxiosResponse<{ valid: number; msgtext: string }> = await axios.post(
        `${apiUrl}?secretkey=${secretCode}&tipe=cekKartuAkses`,
        { nokartuakses: id },
        {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    addVisitor,
    getHeaderTableVisitor,
    getDataVisitor,
    checkIDCardAkses,
    historyDataVisitor,
    // clearSessionVisitor
  }
}

export default VisitorService
