"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Post = {
  id: string;
  title: string;
  content: string;
  view_count: number;
  like_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  category_id: string | null;
  author_id: string;

  author?: {
    full_name: string;
    city: string | null;
    university: string | null;
  };

  category?: {
    name: string;
  };
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author_id: string;

  author?: {
    full_name: string;
    city: string | null;
    university: string | null;
  };
};

export default function ForumPostPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(
    null
  );

  const [comments, setComments] = useState<
    Comment[]
  >([]);

  const [commentText, setCommentText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [approved, setApproved] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // ==================================================
  // VERİLERİ YÜKLE
  // ==================================================

  useEffect(() => {
    async function loadPage() {
      setLoading(true);

      // Kullanıcı
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);

        const { data: alumni } =
          await supabase
            .from("alumni")
            .select("status")
            .eq("id", user.id)
            .maybeSingle();

        if (
          alumni?.status === "approved"
        ) {
          setApproved(true);
        }
      }

      // ----------------------------------------------
      // BAŞLIK
      // ----------------------------------------------

      const {
        data: postData,
        error: postError,
      } = await supabase
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
          category_id,
          author_id
        `)
        .eq("id", postId)
        .single();

      if (postError) {
        console.error(postError);
        setMessage(
          "Forum konusu bulunamadı."
        );
        setLoading(false);
        return;
      }

      // Yazar
      const { data: author } =
        await supabase
          .from("alumni")
          .select(
            "full_name,city,university"
          )
          .eq(
            "id",
            postData.author_id
          )
          .maybeSingle();

      // Kategori
      let category = null;

      if (postData.category_id) {
        const { data } =
          await supabase
            .from(
              "forum_categories"
            )
            .select("name")
            .eq(
              "id",
              postData.category_id
            )
            .maybeSingle();

        category = data;
      }

      setPost({
        ...postData,
        author: author || undefined,
        category: category || undefined,
      });

      // ----------------------------------------------
      // YORUMLAR
      // ----------------------------------------------

      const {
        data: commentData,
        error: commentError,
      } = await supabase
        .from("forum_comments")
        .select(`
          id,
          content,
          created_at,
          author_id
        `)
        .eq("post_id", postId)
        .order("created_at", {
          ascending: true,
        });

      if (commentError) {
        console.error(commentError);
      }

      const commentsWithAuthors =
        await Promise.all(
          (commentData || []).map(
            async (comment) => {
              const {
                data: commentAuthor,
              } = await supabase
                .from("alumni")
                .select(
                  "full_name,city,university"
                )
                .eq(
                  "id",
                  comment.author_id
                )
                .maybeSingle();

              return {
                ...comment,
                author:
                  commentAuthor ||
                  undefined,
              };
            }
          )
        );

      setComments(
        commentsWithAuthors
      );

      // ----------------------------------------------
      // GÖRÜNTÜLEME SAYISI
      // ----------------------------------------------

      await supabase
        .from("forum_posts")
        .update({
          view_count:
            (postData.view_count || 0) +
            1,
        })
        .eq("id", postId);

      setLoading(false);
    }

    if (postId) {
      loadPage();
    }
  }, [postId]);

  // ==================================================
  // YORUM EKLE
  // ==================================================

  async function addComment() {
    setMessage("");

    if (!commentText.trim()) {
      setMessage(
        "Lütfen bir yorum yazın."
      );
      return;
    }

    if (!currentUserId) {
      setMessage(
        "Yorum yapmak için giriş yapmalısınız."
      );
      return;
    }

    if (!approved) {
      setMessage(
        "Yorum yapmak için mezun profilinizin onaylanmış olması gerekir."
      );
      return;
    }

    if (post?.is_locked) {
      setMessage(
        "Bu konu yorumlara kapatılmış."
      );
      return;
    }

    setSaving(true);

    const {
      data,
      error,
    } = await supabase
      .from("forum_comments")
      .insert({
        post_id: postId,
        author_id: currentUserId,
        content:
          commentText.trim(),
      })
      .select(
        "id,content,created_at,author_id"
      )
      .single();

    if (error) {
      console.error(error);

      setMessage(
        "Yorum gönderilemedi: " +
          error.message
      );

      setSaving(false);
      return;
    }

    // Kendi yazar bilgilerimizi al
    const { data: author } =
      await supabase
        .from("alumni")
        .select(
          "full_name,city,university"
        )
        .eq(
          "id",
          currentUserId
        )
        .maybeSingle();

    setComments((old) => [
      ...old,
      {
        ...data,
        author:
          author || undefined,
      },
    ]);

    setCommentText("");
    setSaving(false);
  }

  // ==================================================
  // YORUM SİL
  // ==================================================

  async function deleteComment(
    commentId: string
  ) {
    const confirmed =
      window.confirm(
        "Bu yorumu silmek istediğinize emin misiniz?"
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from("forum_comments")
        .delete()
        .eq("id", commentId)
        .eq(
          "author_id",
          currentUserId
        );

    if (error) {
      console.error(error);

      setMessage(
        "Yorum silinemedi: " +
          error.message
      );

      return;
    }

    setComments((old) =>
      old.filter(
        (comment) =>
          comment.id !== commentId
      )
    );
  }

  // ==================================================
  // YÜKLENİYOR
  // ==================================================

  if (loading) {
    return (
      <main className="page">
        <p className="muted">
          Forum konusu yükleniyor...
        </p>
      </main>
    );
  }

  // ==================================================
  // HATA
  // ==================================================

  if (!post) {
    return (
      <main className="page">
        <h1>❌ Konu bulunamadı</h1>

        <p className="muted">
          {message ||
            "Bu forum konusu artık mevcut değil."}
        </p>

        <Link
          href="/forum"
          className="btn"
        >
          ← Foruma Dön
        </Link>
      </main>
    );
  }

  // ==================================================
  // SAYFA
  // ==================================================

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
        boxSizing:
          "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "950px",
          margin: "0 auto",
        }}
      >
        {/* GERİ */}

        <Link
          href="/forum"
          style={{
            color: "#94a3b8",
            textDecoration:
              "none",
            fontSize: "14px",
          }}
        >
          ← Foruma dön
        </Link>

        {/* BAŞLIK */}

        <article
          style={{
            marginTop: "20px",
            background:
              "#0d1929",
            border:
              "1px solid #24344d",
            borderRadius:
              "16px",
            padding: "30px",
          }}
        >
          {/* KATEGORİ */}

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom:
                "15px",
            }}
          >
            {post.is_pinned && (
              <span
                style={{
                  background:
                    "#312e81",
                  color:
                    "#c7d2fe",
                  padding:
                    "5px 10px",
                  borderRadius:
                    "20px",
                  fontSize:
                    "12px",
                  fontWeight:
                    700,
                }}
              >
                📌 Sabit
              </span>
            )}

            {post.category && (
              <span
                style={{
                  background:
                    "#12304a",
                  color:
                    "#7dd3fc",
                  padding:
                    "5px 10px",
                  borderRadius:
                    "20px",
                  fontSize:
                    "12px",
                  fontWeight:
                    700,
                }}
              >
                {post.category.name}
              </span>
            )}

            {post.is_locked && (
              <span
                style={{
                  background:
                    "#3f2930",
                  color:
                    "#fda4af",
                  padding:
                    "5px 10px",
                  borderRadius:
                    "20px",
                  fontSize:
                    "12px",
                  fontWeight:
                    700,
                }}
              >
                🔒 Kilitli
              </span>
            )}
          </div>

          {/* BAŞLIK */}

          <h1
            style={{
              fontSize:
                "34px",
              lineHeight:
                "1.25",
              margin:
                "0 0 20px",
              fontWeight:
                800,
            }}
          >
            {post.title}
          </h1>

          {/* YAZAR */}

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "12px",
              paddingBottom:
                "20px",
              borderBottom:
                "1px solid #24344d",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius:
                  "50%",
                background:
                  "#1597e5",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize:
                  "20px",
              }}
            >
              👤
            </div>

            <div>
              <strong>
                {post.author
                  ?.full_name ||
                  "BİLSEM Mezunu"}
              </strong>

              <div
                style={{
                  color:
                    "#94a3b8",
                  fontSize:
                    "13px",
                  marginTop:
                    "3px",
                }}
              >
                {post.author
                  ?.university ||
                  ""}

                {post.author
                  ?.city
                  ? ` · ${post.author.city}`
                  : ""}
              </div>
            </div>

            <div
              style={{
                marginLeft:
                  "auto",
                color:
                  "#64748b",
                fontSize:
                  "13px",
              }}
            >
              {new Date(
                post.created_at
              ).toLocaleDateString(
                "tr-TR"
              )}
            </div>
          </div>

          {/* İÇERİK */}

          <div
            style={{
              marginTop:
                "25px",
              fontSize:
                "16px",
              lineHeight:
                "1.8",
              whiteSpace:
                "pre-wrap",
              color:
                "#e2e8f0",
            }}
          >
            {post.content}
          </div>

          {/* İSTATİSTİK */}

          <div
            style={{
              marginTop:
                "25px",
              paddingTop:
                "18px",
              borderTop:
                "1px solid #24344d",
              display:
                "flex",
              gap: "20px",
              color:
                "#64748b",
              fontSize:
                "13px",
            }}
          >
            <span>
              👁️{" "}
              {post.view_count} görüntülenme
            </span>

            <span>
              👍{" "}
              {post.like_count} beğeni
            </span>

            <span>
              💬{" "}
              {comments.length} yorum
            </span>
          </div>
        </article>

        {/* ==================================================
            YORUMLAR
        ================================================== */}

        <section
          style={{
            marginTop:
              "25px",
          }}
        >
          <h2
            style={{
              fontSize:
                "24px",
              marginBottom:
                "18px",
            }}
          >
            💬 Yorumlar
            <span
              style={{
                color:
                  "#64748b",
                fontSize:
                  "16px",
                marginLeft:
                  "8px",
              }}
            >
              ({comments.length})
            </span>
          </h2>

          {/* YORUM LİSTESİ */}

          {comments.length === 0 ? (
            <div
              style={{
                background:
                  "#0d1929",
                border:
                  "1px solid #24344d",
                borderRadius:
                  "12px",
                padding:
                  "30px",
                textAlign:
                  "center",
                color:
                  "#64748b",
              }}
            >
              Henüz yorum yok.
              <br />
              <span
                style={{
                  fontSize:
                    "13px",
                }}
              >
                İlk yorumu sen
                yapabilirsin.
              </span>
            </div>
          ) : (
            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: "12px",
              }}
            >
              {comments.map(
                (comment) => (
                  <div
                    key={
                      comment.id
                    }
                    style={{
                      background:
                        "#0d1929",
                      border:
                        "1px solid #24344d",
                      borderRadius:
                        "12px",
                      padding:
                        "20px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "10px",
                        marginBottom:
                          "12px",
                      }}
                    >
                      <div
                        style={{
                          width:
                            "34px",
                          height:
                            "34px",
                          borderRadius:
                            "50%",
                          background:
                            "#164e63",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >
                        👤
                      </div>

                      <div>
                        <strong>
                          {comment
                            .author
                            ?.full_name ||
                            "BİLSEM Mezunu"}
                        </strong>

                        <div
                          style={{
                            color:
                              "#64748b",
                            fontSize:
                              "12px",
                          }}
                        >
                          {comment
                            .author
                            ?.city ||
                            ""}
                          {" · "}
                          {new Date(
                            comment.created_at
                          ).toLocaleDateString(
                            "tr-TR"
                          )}
                        </div>
                      </div>

                      {currentUserId ===
                        comment.author_id && (
                        <button
                          onClick={() =>
                            deleteComment(
                              comment.id
                            )
                          }
                          style={{
                            marginLeft:
                              "auto",
                            background:
                              "transparent",
                            border:
                              "none",
                            color:
                              "#f87171",
                            cursor:
                              "pointer",
                            fontSize:
                              "13px",
                          }}
                        >
                          🗑️ Sil
                        </button>
                      )}
                    </div>

                    <div
                      style={{
                        color:
                          "#cbd5e1",
                        lineHeight:
                          "1.7",
                        whiteSpace:
                          "pre-wrap",
                      }}
                    >
                      {comment.content}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* ==================================================
              YORUM FORMU
          ================================================== */}

          {!post.is_locked && (
            <div
              style={{
                marginTop:
                  "25px",
                background:
                  "#0d1929",
                border:
                  "1px solid #24344d",
                borderRadius:
                  "12px",
                padding:
                  "22px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom:
                    "12px",
                }}
              >
                ✍️ Yorum Yaz
              </h3>

              {!currentUserId && (
                <p
                  style={{
                    color:
                      "#94a3b8",
                    fontSize:
                      "14px",
                  }}
                >
                  Yorum yapmak için
                  giriş yapmalısınız.
                </p>
              )}

              {currentUserId &&
                !approved && (
                  <p
                    style={{
                      color:
                        "#fbbf24",
                      fontSize:
                        "14px",
                    }}
                  >
                    Yorum yapabilmek
                    için mezun profilinizin
                    yönetici tarafından
                    onaylanmış olması gerekir.
                  </p>
                )}

              {approved && (
                <>
                  <textarea
                    value={
                      commentText
                    }
                    onChange={(e) =>
                      setCommentText(
                        e.target
                          .value
                      )
                    }
                    placeholder="Düşüncenizi paylaşın..."
                    rows={5}
                    maxLength={
                      5000
                    }
                    style={{
                      width:
                        "100%",
                      boxSizing:
                        "border-box",
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
                        "15px",
                      lineHeight:
                        "1.6",
                      resize:
                        "vertical",
                      fontFamily:
                        "inherit",
                    }}
                  />

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginTop:
                        "10px",
                    }}
                  >
                    <span
                      style={{
                        color:
                          "#64748b",
                        fontSize:
                          "12px",
                      }}
                    >
                      {
                        commentText.length
                      }
                      /5000
                    </span>

                    <button
                      onClick={
                        addComment
                      }
                      disabled={
                        saving
                      }
                      style={{
                        padding:
                          "11px 20px",
                        border:
                          "none",
                        borderRadius:
                          "8px",
                        background:
                          saving
                            ? "#475569"
                            : "#1597e5",
                        color:
                          "white",
                        fontWeight:
                          700,
                        cursor:
                          saving
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {saving
                        ? "Gönderiliyor..."
                        : "💬 Yorumu Gönder"}
                    </button>
                  </div>
                </>
              )}

              {message && (
                <div
                  style={{
                    marginTop:
                      "12px",
                    padding:
                      "10px 14px",
                    borderRadius:
                      "8px",
                    background:
                      "#351b16",
                    color:
                      "#fed7aa",
                    fontSize:
                      "14px",
                  }}
                >
                  {message}
                </div>
              )}
            </div>
          )}

          {post.is_locked && (
            <div
              style={{
                marginTop:
                  "20px",
                padding:
                  "15px",
                borderRadius:
                  "10px",
                background:
                  "#2a2025",
                border:
                  "1px solid #4c2732",
                color:
                  "#fda4af",
                textAlign:
                  "center",
              }}
            >
              🔒 Bu konu yeni
              yorumlara kapatılmıştır.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}