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
  kodetiket?: string
}
export interface HeaderItem {
  label: string // Nama header
  width: string | number // Lebar kolom (dalam piksel atau persen)
}

export interface IResponseHeaderVisitor {
  header: {
    label: string
    width: string | number
  }[]
}

export interface Visitor {
  idpengunjung: string
  tanggal: string
  kodetiket: string
  nama: string
  telp: string
  noktp: string
  sex: string
  tujuan: string
  cpprsh: string
  alasan: string
  createby: string
  foto1: string
  foto2: string
  foto3: string
  statuspengunjung: string
}

export interface IPayloadHistoryVisitor {
  idpengunjung: string
  tanggal: string
  createby: string
}

export interface IHistoryVisitor {
  tanggal: string
  idgate: string
  aksi: string
  lantai: string
}
export interface IPayloadClearSessionVisitor {
  idpengunjung: string
  kodetiket: string
  userid: string
}
