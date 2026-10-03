"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CITY_COORDINATES } from "@/lib/cities";
export default function Register() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    const f = new FormData(e.currentTarget);

    const email = String(f.get("email") || "");
    const password = String(f.get("password") || "");

    const supabase = createClient();

    // Kullanıcı hesabını oluştur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
      setBusy(false);
      return;
    }

    if (!data.user) {
      setMsg("Kayıt oluşturulamadı.");
      setBusy(false);
      return;
    }

    // Profil bilgilerini API'ye gönder
    const profileData = {
      full_name: String(f.get("full_name") || ""),
      bilsem_name: String(f.get("bilsem_name") || ""),
      graduation_year: Number(f.get("graduation_year") || 0),
      university: String(f.get("university") || ""),
      department: String(f.get("department") || ""),
      city: String(f.get("city") || ""),
      country: String(f.get("country") || "Türkiye"),
      bio: String(f.get("bio") || ""),
      interests: String(f.get("interests") || ""),
      mentoring_areas: String(f.get("mentoring_areas") || ""),
      mentoring_needs: String(f.get("mentoring_needs") || ""),
      profession: String(f.get("profession") || ""),
      achievements: String(f.get("achievements") || ""),
      website: String(f.get("website") || ""),
      photo_url: "",
    };

    const accessToken = data.session?.access_token;

if (!accessToken) {
  setMsg(
    "Hesap oluşturuldu ancak oturum başlatılamadı. Lütfen tekrar giriş yapın."
  );
  setBusy(false);
  return;
}

const city = String(f.get("city") || "").trim();
const country = String(f.get("country") || "Türkiye").trim();

const coordinates = CITY_COORDINATES[city];

if (country === "Türkiye" && !coordinates) {
  setMsg(
    "Şehir bulunamadı. Lütfen Türkiye'deki ilin tam adını yazınız."
  );
  setBusy(false);
  return;
}

const { error: profileError } = await supabase
  .from("alumni")
  .insert({
    id: data.user.id,

    full_name: profileData.full_name,
    bilsem_name: profileData.bilsem_name,
    graduation_year: profileData.graduation_year,
    university: profileData.university,
    department: profileData.department,

    city,
    country,

    latitude: coordinates?.latitude ?? null,
    longitude: coordinates?.longitude ?? null,

    location_visibility: "city",

    bio: profileData.bio,
    interests: profileData.interests
      ? String(profileData.interests)
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      : [],

    mentoring_areas: profileData.mentoring_areas
      ? String(profileData.mentoring_areas)
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      : [],

    mentoring_needs: profileData.mentoring_needs || null,
    profession: profileData.profession || null,
    achievements: profileData.achievements || null,
    website: profileData.website || null,

    photo_url: null,
    status: "pending",
  });

if (profileError) {
  setMsg(
    "Profil kaydedilemedi: " + profileError.message
  );
} else {
  setMsg(
    "Başvurun alındı. Yönetici onayından sonra profilin ve haritadaki konumun yayınlanacak."
  );
  e.currentTarget.reset();
}

    setBusy(false);
  }

  return (
    <div className="page">
      <form className="form" onSubmit={submit}>
        <h1>🌍 BİLSEM Mezun Kaydı</h1>

        <p className="muted">
          BİLSEM Mezun Ağı'na katılmak için bilgilerini doldur.
          Profilin yönetici onayından sonra yayınlanır.
        </p>

        {/* HESAP BİLGİLERİ */}
        <h2>🔐 Hesap Bilgileri</h2>

        <label>E-posta *</label>
        <input
          name="email"
          type="email"
          placeholder="ornek@email.com"
          required
        />

        <label>Şifre *</label>
        <input
          name="password"
          type="password"
          minLength={8}
          placeholder="En az 8 karakter"
          required
        />

        {/* KİŞİSEL BİLGİLER */}
        <h2>👤 Mezun Bilgileri</h2>

        <label>Ad Soyad *</label>
        <input
          name="full_name"
          placeholder="Adınız Soyadınız"
          required
        />

        <label>Mezun Olunan BİLSEM *</label>
        <input
          name="bilsem_name"
          placeholder="Örn. Düzce BİLSEM"
          required
        />

        <label>BİLSEM Mezuniyet Yılı *</label>
        <input
          name="graduation_year"
          type="number"
          min="1980"
          max="2100"
          placeholder="Örn. 2015"
          required
        />

        <label>Okuduğu Üniversite *</label>
        <input
          name="university"
          placeholder="Üniversite adı"
          required
        />

        <label>Bölüm *</label>
        <input
          name="department"
          placeholder="Bölümünüz"
          required
        />

        <div className="row">
          <div>
            <label>Yaşadığı Şehir *</label>
            <input
              name="city"
              placeholder="Örn. Düzce"
              required
            />
          </div>

          <div>
            <label>Ülke *</label>
            <input
              name="country"
              defaultValue="Türkiye"
              required
            />
          </div>
        </div>

        {/* KENDİNİ TANIT */}
        <h2>📝 Profil</h2>

        <label>Kendini Tanıt *</label>
        <textarea
          name="bio"
          placeholder="Kısaca kendinden, eğitiminden ve çalışmalarından bahset..."
          required
        />

        <label>İlgi Alanları</label>
        <input
          name="interests"
          placeholder="Yapay zekâ, matematik, biyoloji, girişimcilik..."
        />

        <label>Mentörlük Verebileceği Alanlar</label>
        <input
          name="mentoring_areas"
          placeholder="Yazılım, akademik kariyer, matematik..."
        />

        <label>Mentörlük Almak İstediği Alanlar</label>
        <input
          name="mentoring_needs"
          placeholder="Girişimcilik, kariyer, yurt dışı eğitim..."
        />

        <label>Mevcut Meslek / Çalıştığı Alan</label>
        <input
          name="profession"
          placeholder="Örn. Yazılım Mühendisi"
        />

        <label>Başarılar / Projeler / Çalışmalar</label>
        <textarea
          name="achievements"
          placeholder="Projeler, yarışmalar, ödüller, akademik çalışmalar..."
        />

        <label>LinkedIn / Kişisel Web Sitesi</label>
        <input
          name="website"
          type="url"
          placeholder="https://..."
        />

        {/* FOTOĞRAF */}
        <label>Fotoğraf</label>
        <input
          name="photo"
          type="file"
          accept="image/*"
        />

        <div className="notice">
          🔒 <strong>Gizlilik:</strong> Haritada yalnızca
          şehir/ülke düzeyindeki konumunuz gösterilir. Açık
          adresiniz veya kesin konumunuz paylaşılmaz.
        </div>

        <button className="btn" disabled={busy}>
          {busy ? "Gönderiliyor…" : "Başvuruyu Gönder"}
        </button>

        {msg && <div className="notice">{msg}</div>}
      </form>
    </div>
  );
}