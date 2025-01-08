import Swal from 'sweetalert2'
import { MD5 } from 'crypto-js'

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  }
})

export const cekWaktu = (nilaijam: string): boolean => {
  // Mendapatkan waktu saat ini
  const waktuSekarang = new Date()
  const jamSekarang = waktuSekarang.getHours()
  const menitSekarang = waktuSekarang.getMinutes()

  // Membagi waktu yang dipilih menjadi jam dan menit
  const waktuArray = nilaijam.split(':')
  const jamDipilih = parseInt(waktuArray[0], 10)
  const menitDipilih = parseInt(waktuArray[1], 10)

  // Membandingkan waktu yang dipilih dengan waktu saat ini
  if (jamDipilih < jamSekarang || (jamDipilih === jamSekarang && menitDipilih < menitSekarang)) {
    return false
  } else {
    return true
  }
}

export const getDigitMD5Serial = (nilai): string => {
  const onlyNumber = nilai.replace(/\D/g, '')

  // Mengambil 10 digit pertama (jika tersedia)
  const first10Digits = onlyNumber.slice(0, 10)

  // Mengisi dengan 0 jika panjangnya kurang dari 10
  const digitCount = first10Digits.length
  if (digitCount < 10) {
    const sisaDigit = 10 - digitCount
    const nol = '0'.repeat(sisaDigit)
    return first10Digits + nol
  } else {
    return first10Digits
  }
}

export const recursiveMD5 = (text, rounds): string => {
  if (rounds === 0) {
    return text
  } else {
    return recursiveMD5(MD5(text).toString(), rounds - 1)
  }
}
