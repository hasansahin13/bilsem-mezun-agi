"use client";

import { useState } from "react";

const announcements = [
  {
    type: "🎓 Üniversite",
    title: "Üniversite ve bölüm duyuruları",
    text: "Üniversitelerin lisans, yüksek lisans ve doktora başvuruları ile akademik duyuruları burada paylaşılabilir.",
  },
  {
    type: "💰 Burs",
    title: "Burs ve destek fırsatları",
    text: "BİLSEM mezunlarının yararlanabileceği burs, eğitim desteği ve benzeri fırsatlar burada yayınlanabilir.",
  },
  {
    type: "🔬 Proje",
    title: "Proje ve yarışma duyuruları",
    text: "TÜBİTAK, TEKNOFEST, Erasmus+ ve diğer proje ve yarışmalarla ilgili duyurular paylaşılabilir.",
  },
  {
    type: "📚 Eğitim",
    title: "Eğitim ve gelişim fırsatları",
    text: "Kurs, seminer, konferans, webinar ve diğer eğitim fırsatları burada duyurulabilir.",
  },
];

export default function Announcements() {
  const [selected, setSelected] = useState("Tümü");

  const categories = [
    "Tümü",
    "🎓 Üniversite",
    "💰 Burs",
    "🔬 Proje",
    "📚 Eğitim",
  ];

  const filtered =
    selected === "Tümü"
      ? announcements
      : announcements.filter((x) => x.type === selected);

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
        <div style={{ marginBottom: "32px" }}>
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
            📢 BİLSEM MEZUN AĞI
          </div>

          <h1
            style={{
              fontSize: "40px",
              margin: "0 0 10px",
              fontWeight: 800,
            }}
          >
            Duyurular
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
            Üniversite, burs, proje, yarışma ve eğitim fırsatlarını
            BİLSEM mezunlarıyla buluşturuyoruz.
          </p>
        </div>

        {/* KATEGORİLER */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "25px",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelected(category)}
              style={{
                border: "1px solid #334155",
                background:
                  selected === category
                    ? "#1597e5"
                    : "#111f32",
                color: "#fff",
                padding: "9px 14px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* DUYURULAR */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(300px,1fr))",
            gap: "20px",
          }}
        >
          {filtered.map((item, index) => (
            <article
              key={index}
              className="card"
              style={{
                padding: "25px",
              }}
            >
              <span className="pill">
                {item.type}
              </span>

              <h2
                style={{
                  margin: "18px 0 12px",
                  fontSize: "21px",
                }}
              >
                {item.title}
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  lineHeight: "1.7",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                {item.text}
              </p>

              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "14px",
                  borderTop: "1px solid #24344d",
                  color: "#38bdf8",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                BİLSEM Mezun Ağı
              </div>
            </article>
          ))}
        </div>

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
          📢 Duyurular bölümü ilerleyen aşamada yönetici tarafından
          yeni duyurular eklenebilecek şekilde geliştirilebilir.
        </div>
      </div>
    </main>
  );
}