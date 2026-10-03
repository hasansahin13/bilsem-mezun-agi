import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ForumPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("forum_categories")
    .select("*")
    .order("name");

  const { data: posts } = await supabase
    .from("forum_posts")
    .select(`
      id,
      title,
      content,
      view_count,
      like_count,
      is_pinned,
      is_locked,
      created_at,
      category_id
    `)
    .order("is_pinned", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>💬 Mezun Forumu</h1>

          <p className="muted">
            BİLSEM mezunlarının deneyimlerini,
            fikirlerini ve projelerini paylaşabileceği
            alan.
          </p>
        </div>

        <Link
          href="/forum/new"
          className="btn"
        >
          + Yeni Başlık
        </Link>
      </div>

      {/* KATEGORİLER */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <button className="btn">
          Tümü
        </button>

        {(categories || []).map(
          (category) => (
            <button
              key={category.id}
              className="btn secondary"
            >
              {category.name}
            </button>
          )
        )}
      </div>

      {/* BAŞLIKLAR */}

      <div className="panel">
        <h2>Son Konular</h2>

        {!posts ||
        posts.length === 0 ? (
          <div
            style={{
              padding: "40px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "15px",
              }}
            >
              💬
            </div>

            <h3>
              Henüz forum konusu yok
            </h3>

            <p className="muted">
              İlk başlığı sen oluştur!
            </p>

            <Link
              href="/forum/new"
              className="btn"
            >
              İlk Başlığı Aç
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/forum/${post.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "18px",
                    transition:
                      "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin:
                            "0 0 8px 0",
                        }}
                      >
                        {post.is_pinned &&
                          "📌 "}
                        {post.title}
                      </h3>

                      <p className="muted">
                        {post.content.length >
                        180
                          ? post.content.slice(
                              0,
                              180
                            ) + "..."
                          : post.content}
                      </p>
                    </div>

                    <div
                      style={{
                        whiteSpace:
                          "nowrap",
                        fontSize: "13px",
                        color:
                          "#6b7280",
                      }}
                    >
                      👁️{" "}
                      {post.view_count}
                      <br />
                      👍{" "}
                      {post.like_count}
                    </div>
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