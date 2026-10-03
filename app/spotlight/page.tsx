import { createClient } from "@/lib/supabase/server";

export default async function Spotlight() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("alumni")
    .select(
      "id,full_name,university,department,city,country,bio,profession,achievements"
    )
    .eq("status", "approved")
    .eq("is_featured", true)
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <main className="page">
        <h1>⭐ Mezun Sahnesi</h1>
        <p className="muted">
          Mezun sahnesi yüklenirken bir hata oluştu.
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
              background: "#30250b",
              color: "#fbbf24",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            ⭐ BİLSEM MEZUN SAHNESİ
          </div>

          <h1
            style={{
              fontSize: "40px",
              margin: "0 0 10px",
              fontWeight: 800,
            }}
          >
            Başarı Hikâyeleri
          </h1>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "16px",
              maxWidth: "700px",
              lineHeight: "1.6",
            }}
          >
            BİLSEM mezunlarının eğitim, kariyer, bilim ve
            projelerdeki yolculuklarını keşfedin.
          </p>
        </div>

        {alumni.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "70px 20px",
            }}
          >
            <div style={{ fontSize: "55px" }}>⭐</div>

            <h2>Henüz öne çıkan mezun yok</h2>

            <p className="muted">
              Yönetici tarafından öne çıkarılan mezunlar
              burada görünecek.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(320px,1fr))",
              gap: "22px",
            }}
          >
            {alumni.map((a) => (
              <article
                key={a.id}
                className="card"
                style={{
                  padding: "28px",
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
                      "linear-gradient(90deg,#f59e0b,#7c3aed,#1597e5)",
                  }}
                />

                <span
                  style={{
                    display: "inline-block",
                    padding: "5px 9px",
                    borderRadius: "12px",
                    background: "#30250b",
                    color: "#fbbf24",
                    fontSize: "11px",
                    fontWeight: 800,
                    marginBottom: "18px",
                  }}
                >
                  ⭐ ÖNE ÇIKAN MEZUN
                </span>

                <h2
                  style={{
                    margin: "0 0 8px",
                    fontSize: "25px",
                  }}
                >
                  {a.full_name}
                </h2>

                <div
                  style={{
                    color: "#38bdf8",
                    fontSize: "14px",
                    marginBottom: "14px",
                  }}
                >
                  📍 {a.city || "—"}, {a.country || "Türkiye"}
                </div>

                <div
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    background: "#111f32",
                    marginBottom: "16px",
                    lineHeight: "1.6",
                    fontSize: "14px",
                  }}
                >
                  🎓 <b>{a.university || "Üniversite belirtilmemiş"}</b>
                  {a.department && (
                    <>
                      <br />
                      📚 {a.department}
                    </>
                  )}
                  {a.profession && (
                    <>
                      <br />
                      💼 {a.profession}
                    </>
                  )}
                </div>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.7",
                    fontSize: "14px",
                    margin: "0 0 18px",
                  }}
                >
                  {a.bio || "Mezun hikâyesi yakında eklenecek."}
                </p>

                {a.achievements && (
                  <div
                    style={{
                      paddingTop: "16px",
                      borderTop: "1px solid #24344d",
                    }}
                  >
                    <div
                      style={{
                        color: "#fbbf24",
                        fontWeight: 700,
                        fontSize: "13px",
                        marginBottom: "7px",
                      }}
                    >
                      🏆 Başarılar
                    </div>

                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      }}
                    >
                      {a.achievements}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}