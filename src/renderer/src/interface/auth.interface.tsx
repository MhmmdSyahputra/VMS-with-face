export interface IPayloadLogin {
  userid: string
  passuser: string
}

export interface IResponseLogin {
  valid: number
  namauser: string
  userid: string
  msgtext: string
}
