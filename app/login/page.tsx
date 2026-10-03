"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const f = new FormData(e.currentTarget);
    const s = createClient();

    const { error } = await s.auth.signInWithPassword({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="page">
      <form className="form" onSubmit={go}>
        <h1>BİLSEM Mezun Ağı Girişi</h1>

        <label>E-posta</label>
        <input
          name="email"
          type="email"
          placeholder="E-posta adresiniz"
          required
        />

        <label>Şifre</label>
        <input
          name="password"
          type="password"
          placeholder="Şifreniz"
          required
        />

        <button className="btn" type="submit">
          Giriş Yap
        </button>

        {msg && <div className="notice">{msg}</div>}
      </form>
    </div>
  );
}