import { IMember } from '@renderer/interface/member.interface'
import axios, { AxiosResponse } from 'axios'

interface HeaderResponse {
  header: [string, string][]
}

interface MemberService {
  getDataMember: () => Promise<IMember[]>
  getHeaderTableMember: () => Promise<HeaderResponse>
}

const MemberService = (): MemberService => {
  const dataConfig = localStorage.getItem('dataConfig')
  const apiUrl = JSON.parse(dataConfig!).baseURL
  const secretCode = JSON.parse(dataConfig!).secretCode

  const getDataMember = async (): Promise<IMember[]> => {
    try {
      const response: AxiosResponse<IMember[]> = await axios.get(
        `${apiUrl}?secretkey=${secretCode}&tipe=listDataMember`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getHeaderTableMember = async (): Promise<HeaderResponse> => {
    try {
      const response: AxiosResponse<HeaderResponse> = await axios.get(
        `${apiUrl}?secretkey=${secretCode}&tipe=headerListDataMember`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getDataMember,
    getHeaderTableMember
  }
}

export default MemberService
