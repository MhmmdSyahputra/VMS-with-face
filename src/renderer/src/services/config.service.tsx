import { IGetTypeAccess } from '@renderer/interface/typeAccess.interface'
import { IGetDestination } from '@renderer/interface/destination.interface'
import { IGetReason } from '@renderer/interface/reason.interface'
import { IGetDataStats } from '@renderer/interface/stats.interface'
import axios, { AxiosResponse } from 'axios'

interface ConfigService {
  getDataStats: () => Promise<IGetDataStats>
  getDestination: () => Promise<IGetDestination[]>
  getTypeAccess: () => Promise<IGetTypeAccess[]>
  getReason: () => Promise<IGetReason[]>
  getListTime: () => Promise<{ jam: string }[]>
  getDate: () => Promise<{ tanggal: string }>
}

const ConfigService = (): ConfigService => {
  const dataConfig = localStorage.getItem('dataConfig')
  const apiUrl = JSON.parse(dataConfig!).baseURL
  const secretCode = JSON.parse(dataConfig!).secretCode

  const getDataStats = async (): Promise<IGetDataStats> => {
    try {
      const response: AxiosResponse<IGetDataStats> = await axios.get(
        `${apiUrl}?secretkey=${secretCode}&tipe=dashboardStats`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDestination = async (): Promise<IGetDestination[]> => {
    try {
      const response: AxiosResponse<IGetDestination[]> = await axios.get(
        `${apiUrl}?secretkey=${secretCode}&tipe=listLantaiPerusahaan`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getTypeAccess = async (): Promise<IGetTypeAccess[]> => {
    try {
      const response: AxiosResponse<IGetTypeAccess[]> = await axios.get(
        `${apiUrl}?secretkey=${secretCode}&tipe=listTipeAkses`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getReason = async (): Promise<IGetReason[]> => {
    try {
      const response: AxiosResponse<IGetReason[]> = await axios.get(
        `${apiUrl}?secretkey=${secretCode}&tipe=listAlasanKunjungan`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getListTime = async (): Promise<{ jam: string }[]> => {
    try {
      const response: AxiosResponse<{ jam: string }[]> = await axios.get(
        `${apiUrl}?secretkey=${secretCode}&tipe=listJam`
      )
      console.log(response)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDate = async (): Promise<{ tanggal: string }> => {
    try {
      const response: AxiosResponse<{ tanggal: string }> = await axios.get(
        `${apiUrl}?secretkey=${secretCode}&tipe=getDate`
      )
      console.log(response)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getDataStats,
    getDestination,
    getTypeAccess,
    getReason,
    getListTime,
    getDate
  }
}

export default ConfigService
