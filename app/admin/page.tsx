import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Admin() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    redirect("/login");
  }

  const db = createAdminClient();

  const { data, error } = await db
    .from("alumni")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      "ALUMNI SORGUSU HATASI: " + error.message
    );
  }

  const list = data || [];

  const pending = list.filter(
    (x) => x.status === "pending"
  );

  const approved = list.filter(
    (x) => x.status === "approved"
  );

  const rejected = list.filter(
    (x) => x.status === "rejected"
  );

  const featured = list.filter(
    (x) => x.is_featured === true
  );

  const inBook = list.filter(
    (x) => x.is_in_book === true
  );

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
          maxWidth: "1200px",
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
              background: "#172554",
              color: "#60a5fa",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            👑 YÖNETİCİ PANELİ
          </div>

          <h1
            style={{
              fontSize: "38px",
              margin: "0 0 10px",
              fontWeight: 800,
            }}
          >
            Yönetim Merkezi
          </h1>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
            }}
          >
            BİLSEM Mezun Ağı yönetim ve onay merkezi.
          </p>
        </div>

        {/* YÖNETİCİ */}
        <div
          className="notice"
          style={{
            marginBottom: "25px",
          }}
        >
          👑 Yönetici hesabı: <b>{auth.user.email}</b>
        </div>

        {/* İSTATİSTİKLER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(170px,1fr))",
            gap: "14px",
            marginBottom: "35px",
          }}
        >
          <div className="card">
            <div style={{ fontSize: "26px" }}>👥</div>
            <h2 style={{ margin: "8px 0 3px" }}>
              {list.length}
            </h2>
            <div className="muted">Toplam Kayıt</div>
          </div>

          <div className="card">
            <div style={{ fontSize: "26px" }}>⏳</div>
            <h2
              style={{
                margin: "8px 0 3px",
                color: pending.length
                  ? "#fbbf24"
                  : undefined,
              }}
            >
              {pending.length}
            </h2>
            <div className="muted">Onay Bekleyen</div>
          </div>

          <div className="card">
            <div style={{ fontSize: "26px" }}>✅</div>
            <h2 style={{ margin: "8px 0 3px" }}>
              {approved.length}
            </h2>
            <div className="muted">Onaylı Mezun</div>
          </div>

          <div className="card">
            <div style={{ fontSize: "26px" }}>⭐</div>
            <h2 style={{ margin: "8px 0 3px" }}>
              {featured.length}
            </h2>
            <div className="muted">Öne Çıkan</div>
          </div>

          <div className="card">
            <div style={{ fontSize: "26px" }}>📖</div>
            <h2 style={{ margin: "8px 0 3px" }}>
              {inBook.length}
            </h2>
            <div className="muted">Mezun Kitabında</div>
          </div>

          <div className="card">
            <div style={{ fontSize: "26px" }}>🌍</div>
            <h2 style={{ margin: "8px 0 3px" }}>
              {countries}
            </h2>
            <div className="muted">Ülke</div>
          </div>
        </div>

        {/* ONAY BEKLEYENLER */}
        <section
          className="card"
          style={{
            marginBottom: "25px",
            padding: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                ⏳ Onay Bekleyenler
              </h2>

              <p
                className="muted"
                style={{ marginBottom: 0 }}
              >
                Yeni mezun başvurularını inceleyin.
              </p>
            </div>

            <span className="pill">
              {pending.length} başvuru
            </span>
          </div>

          {pending.length === 0 ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                borderRadius: "10px",
                background: "#0b1625",
                color: "#94a3b8",
              }}
            >
              ✅ Bekleyen başvuru yok.
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table className="table">
                <thead>
                  <tr>
                    <th>Mezun</th>
                    <th>Şehir</th>
                    <th>Üniversite</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>

                <tbody>
                  {pending.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <b>{a.full_name}</b>
                      </td>

                      <td>
                        {a.city || "—"},{" "}
                        {a.country || "Türkiye"}
                      </td>

                      <td>
                        {a.university || "—"}
                      </td>

                      <td>
                        <span
                          style={{
                            color: "#fbbf24",
                            fontWeight: 700,
                          }}
                        >
                          ⏳ Bekliyor
                        </span>
                      </td>

                      <td>
                        <Link
                          className="btn"
                          href={`/admin/alumni/${a.id}`}
                        >
                          İncele →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ÖZET */}
        <section className="card">
          <h2>📊 Ağ Özeti</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                padding: "16px",
                background: "#0b1625",
                borderRadius: "10px",
              }}
            >
              <div className="muted">
                Onaylı mezun
              </div>
              <strong>{approved.length}</strong>
            </div>

            <div
              style={{
                padding: "16px",
                background: "#0b1625",
                borderRadius: "10px",
              }}
            >
              <div className="muted">
                Şehir
              </div>
              <strong>{cities}</strong>
            </div>

            <div
              style={{
                padding: "16px",
                background: "#0b1625",
                borderRadius: "10px",
              }}
            >
              <div className="muted">
                Ülke
              </div>
              <strong>{countries}</strong>
            </div>

            <div
              style={{
                padding: "16px",
                background: "#0b1625",
                borderRadius: "10px",
              }}
            >
              <div className="muted">
                Reddedilen
              </div>
              <strong>{rejected.length}</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}