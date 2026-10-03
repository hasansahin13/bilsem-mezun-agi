import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Alumni() {
  const supabase = await createClient();

  const { data: alumni, error } = await supabase
    .from("alumni")
    .select(
      "id,full_name,bilsem_name,graduation_year,university,department,city,country,bio,profession,is_featured"
    )
    .eq("status", "approved")
    .order("full_name");

  if (error) {
    return (
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          background: "#07111f",
          color: "#f8fafc",
          padding: "50px 20px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1>👥 Mezunlar</h1>
          <p style={{ color: "#f87171" }}>
            Mezunlar yüklenirken bir hata oluştu.
          </p>
        </div>
      </main>
    );
  }

  const list = alumni || [];

  const cities = new Set(
    list.map((x) => x.city).filter(Boolean)
  ).size;

  const countries = new Set(
    list.map((x) => x.country).filter(Boolean)
  ).size;

  return (
    <main
      style={{
        minHeight: "calc(100vh - 68px)",
        background: "#07111f",
        color: "#f8fafc",
        padding: "40px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {/* BAŞLIK */}
        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: "20px",
              background: "#102a43",
              color: "#38bdf8",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            🌍 BİLSEM MEZUN AĞI
          </div>

          <h1
            style={{
              fontSize: "38px",
              margin: "0 0 10px",
              fontWeight: 800,
            }}
          >
            👥 Mezunlar
          </h1>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "16px",
            }}
          >
            Dünyanın farklı şehirlerindeki BİLSEM mezunlarını keşfedin.
          </p>
        </div>

        {/* İSTATİSTİKLER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: "14px",
            marginBottom: "32px",
          }}
        >
          <div className="card">
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>
              👤
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
              }}
            >
              {list.length}
            </div>
            <div className="muted">Onaylı Mezun</div>
          </div>

          <div className="card">
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>
              📍
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
              }}
            >
              {cities}
            </div>
            <div className="muted">Şehir</div>
          </div>

          <div className="card">
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>
              🌎
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
              }}
            >
              {countries}
            </div>
            <div className="muted">Ülke</div>
          </div>
        </div>

        {/* MEZUNLAR */}
        {list.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <div style={{ fontSize: "45px" }}>👤</div>
            <h2>Henüz onaylı mezun yok</h2>
            <p className="muted">
              İlk mezun profilini oluşturmak için kayıt olun.
            </p>

            <Link href="/register" className="joinBtn">
              Mezun Ol
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(280px,1fr))",
              gap: "18px",
            }}
          >
            {list.map((a) => (
              <Link
                key={a.id}
                href={`/alumni/${a.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  className="card"
                  style={{
                    height: "100%",
                    boxSizing: "border-box",
                    transition: "transform .15s ease",
                  }}
                >
                  {/* AVATAR */}
                  <div
                    style={{
                      width: "58px",
                      height: "58px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg,#1597e5,#7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "25px",
                      marginBottom: "15px",
                    }}
                  >
                    👤
                  </div>

                  {/* İSİM */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "20px",
                      }}
                    >
                      {a.full_name}
                    </h3>

                    {a.is_featured && (
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "4px 7px",
                          borderRadius: "10px",
                          background: "#3b2f0b",
                          color: "#fbbf24",
                          fontWeight: 700,
                        }}
                      >
                        ⭐ Öne Çıkan
                      </span>
                    )}
                  </div>

                  {/* KONUM */}
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#38bdf8",
                      fontSize: "14px",
                    }}
                  >
                    📍 {a.city || "—"}, {a.country || "Türkiye"}
                  </div>

                  {/* EĞİTİM */}
                  <div
                    style={{
                      marginTop: "14px",
                      color: "#cbd5e1",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    🎓{" "}
                    {a.university || "Üniversite bilgisi yok"}
                    {a.department
                      ? ` · ${a.department}`
                      : ""}
                  </div>

                  {/* MESLEK */}
                  {a.profession && (
                    <div
                      style={{
                        marginTop: "8px",
                        color: "#94a3b8",
                        fontSize: "13px",
                      }}
                    >
                      💼 {a.profession}
                    </div>
                  )}

                  {/* BİLGİ */}
                  <p
                    style={{
                      marginTop: "15px",
                      color: "#94a3b8",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {a.bio || "BİLSEM mezunu"}
                  </p>

                  {/* ALT */}
                  <div
                    style={{
                      marginTop: "18px",
                      paddingTop: "12px",
                      borderTop: "1px solid #24344d",
                      color: "#38bdf8",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    Profili Gör →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}