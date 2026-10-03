import { createClient } from "@/lib/supabase/server";
import CesiumMap from "@/components/CesiumMap";

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("alumni")
    .select(
      "id,full_name,university,city,country,latitude,longitude"
    )
    .eq("status", "approved");

  const alumni = (data || []).filter(
    (x) => x.latitude != null && x.longitude != null
  ) as any[];

  const countries = new Set(
    alumni.map((x) => x.country).filter(Boolean)
  ).size;

  const cities = new Set(
    alumni.map((x) => x.city).filter(Boolean)
  ).size;

  return (
    <main className="mapWrap">

      {/* HARİTA BAŞLIĞI */}
      <div className="hero">
        <h1>BİLSEM’den Dünyaya 🌍</h1>

        <p>
          Onaylanmış mezunları keşfet · Şehirleri ve ülkeleri
          yakınlaştır · Hikâyelere ulaş
        </p>
      </div>

      {/* HARİTA BİLGİ PANELİ */}
      <div className="panel mapInfoPanel">

        <input
          className="search"
          placeholder="🔎 Mezun, üniversite veya şehir ara…"
          aria-label="Mezun, üniversite veya şehir ara"
        />

        <div className="stats">

          <div className="stat">
            <b>{alumni.length}</b>
            <span>Mezun</span>
          </div>

          <div className="stat">
            <b>{countries}</b>
            <span>Ülke</span>
          </div>

          <div className="stat">
            <b>{cities}</b>
            <span>Şehir</span>
          </div>

        </div>

      </div>

      {/* 3D DÜNYA */}
      <CesiumMap alumni={alumni} />

    </main>
  );
}