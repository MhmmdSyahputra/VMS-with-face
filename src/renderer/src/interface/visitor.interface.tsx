export interface FormPayloadVisitor {
  idkiosk: number
  userid: number
  tanggal: string
  nama: string
  telp: string
  email: string
  sex: string
  prshvisitor: string
  idprsh: number
  namaprsh: string
  idlantai: number
  namalantai: string
  cp: string
  no: string
  idalasan: number
  namaalasan: string
  idakses: number
  nokartuakses: string
  tipekunjungan: number
  waktuakhir: number
}

export interface IResponseAddVisitor {
  valid: number
  msgtext?: string
}
