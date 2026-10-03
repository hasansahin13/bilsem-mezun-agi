import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("ADMIN KONTROLÜ - USER:", user?.email || "YOK");
  console.log("ADMIN KONTROLÜ - AUTH ERROR:", error?.message || "YOK");
  console.log(
    "ADMIN KONTROLÜ - ENV VAR MI:",
    !!process.env.ADMIN_EMAIL
  );

  if (!user) {
    return { ok: false as const, user: null };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();

  console.log(
    "ADMIN KONTROLÜ - EŞLEŞME:",
    user.email?.toLowerCase() === adminEmail
  );

  if (!adminEmail || user.email?.toLowerCase() !== adminEmail) {
    return { ok: false as const, user };
  }

  return { ok: true as const, user };
}