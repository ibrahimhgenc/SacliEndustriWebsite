# Saçlı Endüstri — Kurumsal Web Sitesi

Saçlı Endüstriyel İmalat ve Montaj San. Tic. Ltd. Şti. kurumsal web sitesi ve yönetim paneli projesi.

## Teknoloji Yığını

- **Frontend:** React 19, Vite 5, Tailwind CSS 3, React Router DOM 7
- **Backend / Servisler:** Firebase (Firestore, Authentication, Storage)
- **PDF & Katalog:** `react-pdf`, `react-pageflip`

## Yerel Kurulum (Contributors İçin)

1. Depoyu klonlayın ve bağımlılıkları yükleyin:
   ```bash
   git clone https://github.com/ibrahimhgenc/SacliEndustriWebsite.git
   cd SacliEndustriWebsite
   npm install
   ```

2. Ortam değişkenlerini oluşturun:
   ```bash
   cp .env.example .env
   ```
   `.env` dosyasının içerisine proje yöneticisinden aldığınız Firebase ve Webhook anahtarlarını ekleyin.

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

4. Kod kalitesi ve derleme testi:
   ```bash
   npm run lint
   npm run build
   ```

## CI/CD ve cPanel Dağıtımı (GitHub Actions)

`main` dalına (branch) yapılan her `push` işlemi `.github/workflows/deploy.yml` iş akışını tetikler:
1. ESLint kontrolü (`npm run lint`) ve Production derlemesi (`npm run build`) yapılır.
2. Derlenen `./dist` klasörü FTP üzerinden cPanel sunucusuna otomatik olarak aktarılır.

> **Not:** `public/tanitim_videoTR.mp4` ve `public/tanitim_videoEN.mp4` dosyaları 100 MB üzerindeki boyutları nedeniyle Git deposuna dahil edilmemiştir ve cPanel sunucusunda doğrudan barındırılmaktadır. FTP dağıtımında bu videolar korunur (silinmez).
