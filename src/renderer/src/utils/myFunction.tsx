import Swal from 'sweetalert2'

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
