"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

export default function NewForumPost() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("name");

      if (error) {
        console.error(error);
        setMessage(
          "Kategoriler yüklenirken hata oluştu."
        );
        setLoading(false);
        return;
      }

      setCategories(data || []);

      if (data && data.length > 0) {
        setCategoryId(data[0].id);
      }

      setLoading(false);
    }

    loadCategories();
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setMessage("");

    if (!title.trim()) {
      setMessage("Lütfen başlık yazın.");
      return;
    }

    if (!content.trim()) {
      setMessage("Lütfen içerik yazın.");
      return;
    }

    if (!categoryId) {
      setMessage("Lütfen kategori seçin.");
      return;
    }

    setSaving(true);

    try {
      // Giriş yapan kullanıcı
      const {
        data: {
          user,
        },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage(
          "Forumda konu açmak için giriş yapmalısınız."
        );
        setSaving(false);
        return;
      }

      // Mezun profilini kontrol et
      const {
        data: alumni,
        error: alumniError,
      } = await supabase
        .from("alumni")
        .select("id,status")
        .eq("id", user.id)
        .maybeSingle();

      if (alumniError) {
        console.error(alumniError);

        setMessage(
          "Mezun profili kontrol edilirken hata oluştu."
        );

        setSaving(false);
        return;
      }

      if (!alumni) {
        setMessage(
          "Mezun profiliniz bulunamadı."
        );

        setSaving(false);
        return;
      }

      // Sadece onaylı mezunlar konu açabilir
      if (alumni.status !== "approved") {
        setMessage(
          "Forumda konu açabilmek için mezun profilinizin yönetici tarafından onaylanmış olması gerekir."
        );

        setSaving(false);
        return;
      }

      // Yeni forum konusu
      const {
        data: post,
        error: postError,
      } = await supabase
        .from("forum_posts")
        .insert({
          author_id: user.id,
          category_id: categoryId,
          title: title.trim(),
          content: content.trim(),
        })
        .select("id")
        .single();

      if (postError) {
        console.error(postError);

        setMessage(
          "Konu oluşturulamadı: " +
            postError.message
        );

        setSaving(false);
        return;
      }

      // Konu sayfasına git
      router.push(
        `/forum/${post.id}`
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      setMessage(
        "Beklenmeyen bir hata oluştu."
      );

      setSaving(false);
    }
  }

  // Kategoriler yükleniyor
  if (loading) {
    return (
      <main
        style={{
          minHeight:
            "calc(100vh - 68px)",
          background:
            "#07111f",
          color: "#f8fafc",
          padding: "50px 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <h1>📝 Yeni Başlık</h1>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Kategoriler yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight:
          "calc(100vh - 68px)",
        background:
          "#07111f",
        color: "#f8fafc",
        padding:
          "40px 20px 70px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "950px",
          margin: "0 auto",
        }}
      >
        {/* GERİ DÖN */}

        <Link
          href="/forum"
          style={{
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Foruma dön
        </Link>

        {/* BAŞLIK */}

        <div
          style={{
            marginTop: "18px",
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              fontSize: "34px",
              margin: "0 0 10px",
              fontWeight: 800,
            }}
          >
            📝 Yeni Başlık
          </h1>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "15px",
            }}
          >
            BİLSEM mezunlarıyla paylaşmak
            istediğiniz konuyu oluşturun.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "950px",
            margin: "0 auto",
            background:
              "#0d1929",
            border:
              "1px solid #24344d",
            borderRadius: "16px",
            padding: "30px",
            display: "flex",
            flexDirection:
              "column",
            gap: "24px",
            boxSizing:
              "border-box",
            boxShadow:
              "0 15px 40px rgba(0,0,0,0.25)",
          }}
        >
          {/* KATEGORİ */}

          <div>
            <label
              style={{
                display: "block",
                fontWeight: 700,
                marginBottom:
                  "9px",
                fontSize: "15px",
              }}
            >
              Kategori
            </label>

            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding:
                  "13px 14px",
                borderRadius:
                  "9px",
                border:
                  "1px solid #334155",
                background:
                  "#111f32",
                color:
                  "#f8fafc",
                fontSize:
                  "15px",
                boxSizing:
                  "border-box",
                outline:
                  "none",
              }}
            >
              {categories.map(
                (category) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.id
                    }
                    style={{
                      background:
                        "#111f32",
                      color:
                        "#ffffff",
                    }}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>

            {categoryId && (
              <p
                style={{
                  margin:
                    "7px 0 0",
                  color:
                    "#64748b",
                  fontSize:
                    "13px",
                }}
              >
                {
                  categories.find(
                    (x) =>
                      x.id ===
                      categoryId
                  )?.description
                }
              </p>
            )}
          </div>

          {/* BAŞLIK */}

          <div>
            <label
              style={{
                display: "block",
                fontWeight: 700,
                marginBottom:
                  "9px",
                fontSize: "15px",
              }}
            >
              Başlık
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Konunuzun başlığını yazın..."
              maxLength={150}
              style={{
                width: "100%",
                padding:
                  "14px",
                borderRadius:
                  "9px",
                border:
                  "1px solid #334155",
                background:
                  "#111f32",
                color:
                  "#f8fafc",
                fontSize:
                  "16px",
                boxSizing:
                  "border-box",
                outline:
                  "none",
              }}
            />

            <div
              style={{
                textAlign:
                  "right",
                color:
                  "#64748b",
                fontSize:
                  "12px",
                marginTop:
                  "6px",
              }}
            >
              {title.length}/150
            </div>
          </div>

          {/* İÇERİK */}

          <div>
            <label
              style={{
                display: "block",
                fontWeight: 700,
                marginBottom:
                  "9px",
                fontSize: "15px",
              }}
            >
              İçerik
            </label>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }
              placeholder="Düşüncelerinizi, sorularınızı veya deneyimlerinizi paylaşın..."
              rows={14}
              maxLength={10000}
              style={{
                width: "100%",
                minHeight:
                  "300px",
                padding:
                  "14px",
                borderRadius:
                  "9px",
                border:
                  "1px solid #334155",
                background:
                  "#111f32",
                color:
                  "#f8fafc",
                fontSize:
                  "16px",
                lineHeight:
                  "1.6",
                boxSizing:
                  "border-box",
                outline:
                  "none",
                resize:
                  "vertical",
                fontFamily:
                  "inherit",
              }}
            />

            <div
              style={{
                textAlign:
                  "right",
                color:
                  "#64748b",
                fontSize:
                  "12px",
                marginTop:
                  "6px",
              }}
            >
              {content.length}/10000
            </div>
          </div>

          {/* UYARI / HATA */}

          {message && (
            <div
              style={{
                padding:
                  "13px 16px",
                borderRadius:
                  "9px",
                background:
                  "#351b16",
                border:
                  "1px solid #7c2d12",
                color:
                  "#fed7aa",
                lineHeight:
                  "1.5",
              }}
            >
              {message}
            </div>
          )}

          {/* BUTONLAR */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: "12px",
              paddingTop:
                "5px",
            }}
          >
            <Link
              href="/forum"
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                padding:
                  "11px 20px",
                borderRadius:
                  "9px",
                border:
                  "1px solid #334155",
                background:
                  "#111f32",
                color:
                  "#cbd5e1",
                textDecoration:
                  "none",
                fontWeight:
                  600,
              }}
            >
              Vazgeç
            </Link>

            <button
              type="submit"
              disabled={saving}
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                padding:
                  "12px 22px",
                border: "none",
                borderRadius:
                  "9px",
                background:
                  saving
                    ? "#475569"
                    : "#1597e5",
                color:
                  "#ffffff",
                fontSize:
                  "15px",
                fontWeight:
                  700,
                cursor:
                  saving
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {saving
                ? "Yayınlanıyor..."
                : "🚀 Başlığı Yayınla"}
            </button>
          </div>
        </form>

        {/* ALT BİLGİ */}

        <div
          style={{
            marginTop:
              "18px",
            padding:
              "15px 18px",
            borderRadius:
              "10px",
            background:
              "#0b1625",
            border:
              "1px solid #1e3048",
            color:
              "#64748b",
            fontSize:
              "13px",
            lineHeight:
              "1.6",
          }}
        >
          💡 Forumda yalnızca onaylanmış
          BİLSEM mezunları yeni konu
          oluşturabilir ve yorum yapabilir.
        </div>
      </div>
    </main>
  );
}