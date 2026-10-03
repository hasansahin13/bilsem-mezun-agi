"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Çıkış hatası:",
        error.message
      );
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      style={{
        border: "1px solid #334155",
        background: "#111f32",
        color: "#cbd5e1",
        padding: "9px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "13px",
      }}
    >
      Çıkış Yap
    </button>
  );
}