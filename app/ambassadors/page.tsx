import { createClient } from "@/lib/supabase/server";

export default async function Ambassadors() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("alumni")
    .select(
      "id,full_name,university,department,city,country,bio,profession"
    )
    .eq("status", "approved")
    .order("country")
    .order("city")
    .order("full_name");

  if (error) {
    return (
      <main className="page">
        <h1>🧭 İl Elçileri</h1>
        <p className="muted">
          İl elçileri yüklenirken bir hata oluştu.
        </p>
      </main>
    );
  }

  const alumni = data || [];

  const groups = alumni.reduce(
    (acc, person) => {
      const key = `${person.country || "Türkiye"}|${
        person.city || "Belirtilmemiş"
      }`;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(person);

      return acc;
    },
    {} as Record<string, typeof alumni>
  );

  const locations = Object.entries(groups);

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
            🧭 BİLSEM YEREL AĞI
          </div>

          <h1
            style={{
              fontSize: "40px",
              margin: "0 0 10px",
              fontWeight: 800,
            }}
          >
            İl Elçileri
          </h1>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "16px",
              lineHeight: "1.6",
              maxWidth: "750px",
            }}
          >
            BİLSEM mezunlarının şehir ve bölgelerde birbirleriyle
            bağlantı kurmasını sağlayan yerel ağ.
          </p>
        </div>

        {locations.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "70px 20px",
            }}
          >
            <div style={{ fontSize: "55px" }}>🧭</div>

            <h2>Henüz mezun bulunmuyor</h2>

            <p className="muted">
              Onaylanan mezunlar şehirlerine göre burada
              listelenecek.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(320px,1fr))",
              gap: "20px",
            }}
          >
            {locations.map(([location, people]) => {
              const [country, city] = location.split("|");

              return (
                <section
                  className="card"
                  key={location}
                  style={{
                    padding: "25px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        background: "#102a43",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                      }}
                    >
                      📍
                    </div>

                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "21px",
                        }}
                      >
                        {city}
                      </h2>

                      <div
                        style={{
                          color: "#38bdf8",
                          fontSize: "13px",
                        }}
                      >
                        {country}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "13px",
                      marginBottom: "15px",
                    }}
                  >
                    👥 {people.length} mezun
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {people.map((person) => (
                      <div
                        key={person.id}
                        style={{
                          padding: "12px",
                          background: "#0b1625",
                          borderRadius: "9px",
                          border: "1px solid #1e3048",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            marginBottom: "4px",
                          }}
                        >
                          {person.full_name}
                        </div>

                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: "12px",
                            lineHeight: "1.5",
                          }}
                        >
                          {person.university || "Üniversite belirtilmemiş"}
                          {person.department
                            ? ` · ${person.department}`
                            : ""}
                        </div>

                        {person.profession && (
                          <div
                            style={{
                              color: "#64748b",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            💼 {person.profession}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <div
          style={{
            marginTop: "25px",
            padding: "18px",
            borderRadius: "10px",
            background: "#0b1625",
            border: "1px solid #1e3048",
            color: "#64748b",
            fontSize: "13px",
            lineHeight: "1.6",
          }}
        >
          🧭 İl Elçileri bölümü, mezunların şehirlerindeki BİLSEM
          topluluğuyla bağlantı kurmasını amaçlar. Elçilik görevi
          ilerleyen aşamada yönetici tarafından atanabilir.
        </div>
      </div>
    </main>
  );
}