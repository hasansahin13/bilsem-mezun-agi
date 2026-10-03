import { createClient } from "@/lib/supabase/server";

export default async function Book() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("alumni")
    .select(
      "id,full_name,university,department,city,country,graduation_year,bio"
    )
    .eq("status", "approved")
    .eq("is_in_book", true)
    .order("graduation_year", { ascending: false })
    .order("full_name");

  if (error) {
    return (
      <main className="page">
        <h1>📖 BİLSEM Mezun Kitabı</h1>
        <p className="muted">
          Mezun kitabı yüklenirken bir hata oluştu.
        </p>
      </main>
    );
  }

  const alumni = data || [];

  return (
    <main
      style={{
        minHeight: "calc(100vh - 68px)",
        background: "#07111f",
        color: "#f8fafc",
        padding: "45px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "35px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: "20px",
              background: "#172554",
              color: "#60a5fa",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            📖 DİJİTAL ARŞİV
          </div>

          <h1
            style={{
              fontSize: "40px",
              margin: "0 0 10px",
              fontWeight: 800,
            }}
          >
            BİLSEM Mezun Kitabı
          </h1>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          >
            BİLSEM mezunlarının eğitim ve kariyer yolculuklarını
            yıllar boyunca saklayan dijital arşiv.
          </p>
        </div>

        {/* ÜST BİLGİ */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "30px",
          }}
        >
          <div className="pill">
            👤 {alumni.length} Mezun
          </div>

          <div className="pill">
            📚 Dijital Arşiv
          </div>

          <div className="pill">
            🌍 Dünya Çapında
          </div>
        </div>

        {alumni.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "70px 20px",
            }}
          >
            <div style={{ fontSize: "55px" }}>📖</div>

            <h2>Mezun kitabı henüz boş</h2>

            <p className="muted">
              Kitaba dahil edilen onaylı mezunlar burada
              görünecek.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(300px,1fr))",
              gap: "20px",
            }}
          >
            {alumni.map((a) => (
              <article
                key={a.id}
                className="card"
                style={{
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(90deg,#2563eb,#7c3aed)",
                  }}
                />

                {/* YIL */}
                <div
                  style={{
                    color: "#60a5fa",
                    fontSize: "13px",
                    fontWeight: 800,
                    marginBottom: "10px",
                  }}
                >
                  {a.graduation_year
                    ? `🎓 ${a.graduation_year} MEZUNU`
                    : "🎓 BİLSEM MEZUNU"}
                </div>

                <h2
                  style={{
                    margin: "0 0 10px",
                    fontSize: "23px",
                  }}
                >
                  {a.full_name}
                </h2>

                <div
                  style={{
                    color: "#38bdf8",
                    fontSize: "14px",
                    marginBottom: "15px",
                  }}
                >
                  📍 {a.city || "—"}, {a.country || "Türkiye"}
                </div>

                <div
                  style={{
                    padding: "14px",
                    background: "#111f32",
                    borderRadius: "10px",
                    fontSize: "14px",
                    lineHeight: "1.7",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    🎓{" "}
                    <b>
                      {a.university ||
                        "Üniversite belirtilmemiş"}
                    </b>
                  </div>

                  {a.department && (
                    <div>📚 {a.department}</div>
                  )}
                </div>

                {a.bio && (
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "13px",
                      lineHeight: "1.7",
                      margin: 0,
                    }}
                  >
                    {a.bio}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}