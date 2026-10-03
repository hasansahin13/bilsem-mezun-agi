"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    if (password.length < 8) {
      setMessage("Şifre en az 8 karakter olmalıdır.");
      setBusy(false);
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Şifren başarıyla değiştirildi. Şimdi giriş sayfasından giriş yapabilirsin."
      );
      setPassword("");
    }

    setBusy(false);
  }

  return (
    <div className="page">
      <form className="form" onSubmit={updatePassword}>
        <h1>🔐 Yeni Şifre Belirle</h1>

        <p className="muted">
          Yönetici hesabın için yeni bir şifre oluştur.
        </p>

        <label>Yeni Şifre</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          placeholder="En az 8 karakter"
          required
        />

        <button className="btn" disabled={busy}>
          {busy ? "Kaydediliyor…" : "Şifreyi Değiştir"}
        </button>

        {message && <div className="notice">{message}</div>}
      </form>
    </div>
  );
}