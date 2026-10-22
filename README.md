# FleetOps — Sistem Manajemen Armada

Dashboard React + TypeScript untuk menampilkan data kendaraan dari MBTA V3 REST API. Proyek ini dibuat sebagai contoh implementasi tes teknis Frontend Engineer.

## Fitur

- Daftar kendaraan dalam responsive card grid.
- Data label, status, koordinat, kecepatan, Route, Trip, dan waktu update.
- Pagination API dengan pilihan 5, 10, atau 20 item per halaman.
- Filter multi-select Route dan Trip.
- Lazy loading opsi Route dan Trip saat daftar dropdown digulir.
- Modal detail kendaraan dengan peta Leaflet + OpenStreetMap.
- Loading, error, retry, dan empty state.
- Abort request kendaraan lama saat parameter berubah.
- TypeScript strict mode.

## Persyaratan

- Node.js 20 atau versi LTS yang kompatibel dengan Vite.
- npm.
- Koneksi internet untuk API MBTA dan tile peta OpenStreetMap.

## Instalasi

```bash
npm install
```

Salin `.env.example` menjadi `.env` jika ingin mengubah base URL API:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Kemudian jalankan:

```bash
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya `http://localhost:5173`.

## Validasi

```bash
npm run typecheck
npm run build
```

## API yang digunakan

Base URL: `https://api-v3.mbta.com`

- `GET /vehicles` — daftar kendaraan dan filter `filter[route]`, `filter[trip]`.
- `GET /vehicles/{id}` — detail kendaraan.
- `GET /routes` — pilihan Route.
- `GET /trips` — pilihan Trip; daftar dapat dibatasi menggunakan `filter[route]`.

Dokumentasi: https://api-v3.mbta.com/docs/swagger

API menggunakan format JSON:API. Pagination kendaraan memakai `page[limit]` dan `page[offset]`. Daftar Route/Trip diambil bertahap dengan offset supaya dropdown tidak perlu memuat seluruh opsi sekaligus.

## Arsitektur

- `components/`: UI yang dapat digunakan ulang.
- `hooks/`: pengelolaan state dan lifecycle fetch.
- `services/`: komunikasi HTTP dan penanganan error API.
- `types/`: tipe resource JSON:API.
- `utils/`: formatter waktu, koordinat, dan status.
- `App.tsx`: komposisi halaman, filter, pagination, dan modal.

Komponen UI tidak melakukan request langsung. Fetch API berada di service dan dipanggil oleh hooks agar tanggung jawab lebih terpisah.

## Catatan

- MBTA adalah data transportasi publik Boston, bukan data operasional Transjakarta. API ini digunakan karena merupakan sumber API yang ditentukan dalam soal.
- API dapat mengubah ketersediaan data dan metadata pagination. Jika metadata total tidak tersedia, pagination menggunakan `links.next` bila disediakan.
- Filter yang dipilih diteruskan ke API. Untuk pilihan beberapa Route dan Trip, API menerapkan parameter filter sesuai perilaku endpoint.
- Kecepatan API diasumsikan dalam meter per detik dan dikonversi ke km/jam pada UI.
- Peta hanya menampilkan marker saat latitude dan longitude tersedia.
- Infinite scroll dropdown mengambil halaman berikutnya ketika pengguna menggulir mendekati bagian bawah; pencarian pada dropdown menyaring opsi yang telah dimuat.
- Jangan memasukkan rahasia atau API key ke file `.env` yang di-commit. Variabel `VITE_*` diekspos ke browser.

## Upload ke GitHub

Buat repository kosong di GitHub, lalu jalankan:

```bash
git init
git add .
git commit -m "feat: build fleet management dashboard"
git branch -M main
git remote add origin https://github.com/USERNAME/transjakarta-fleet.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub Anda.
