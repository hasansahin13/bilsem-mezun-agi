# BİLSEM Mezun Ağı — V1

Bu paket, gerçek bir Next.js + Supabase + CesiumJS uygulamasının çalışır V1 iskeletidir.

## Dahil olanlar
- 🌍 CesiumJS 3D dünya küresi
- 👥 Onaylı mezun haritası ve mezun listesi
- 🔐 Supabase e-posta/şifre üyeliği
- ⏳ Mezun başvurusu → `pending`
- 👑 Tek yönetici hesabı ile onay/red
- 📖 Mezun Kitabı
- ⭐ Mezun Sahnesi
- 📍 Şehir/ülke konumu
- 🔒 Adres değil şehir düzeyi konum mantığı
- 📱 Mobil uyumlu temel arayüz

## Kurulum

1. Node.js kurulu bir bilgisayarda klasörü aç:
   `npm install`

2. `.env.example` dosyasını `.env.local` olarak kopyala.

3. Supabase'te yeni proje oluştur ve SQL Editor'da:
   `supabase/schema.sql`
   dosyasını çalıştır.

4. Supabase Dashboard → Connect/API bölümünden Project URL ve Publishable Key değerlerini `.env.local` içine koy.

5. Bir admin e-posta adresi belirle:
   `ADMIN_EMAIL=seninadresin@example.com`

6. Önce uygulamada `/register` üzerinden bu admin e-postasıyla hesap aç. E-posta doğrulaması açıksa doğrula.

7. Supabase API bölümündeki Service Role Key'i:
   `SUPABASE_SERVICE_ROLE_KEY=...`
   olarak sadece `.env.local` / Vercel Environment Variables içine koy.
   Bu anahtarı asla GitHub'a veya tarayıcı koduna koyma.

8. Cesium ion'dan bir Access Token al ve:
   `NEXT_PUBLIC_CESIUM_ION_TOKEN=...`
   olarak ekle.

9. Çalıştır:
   `npm run dev`

10. Tarayıcı:
   `http://localhost:3000`

## Canlı yayın
Vercel'e projeyi bağla ve şu environment variables'ı ekle:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_CESIUM_ION_TOKEN
- ADMIN_EMAIL

Sonra Deploy.

## Önemli
Canlı siteyi bu sohbetten doğrudan internete yayınlayamam; Supabase/Vercel/Cesium hesapları ve gizli anahtarlar sana ait olmalı. Bu paket o son bağlantıları yapmaya hazır şekilde hazırlanmıştır.

## Güvenlik
- Service Role Key yalnızca sunucuda kullanılmalıdır.
- Kamuya sadece `approved` mezunlar açılır.
- Kullanıcı kendi kaydını `approved` yapamaz.
- Haritada ev/adres değil şehir düzeyi konum kullanılması önerilir.
