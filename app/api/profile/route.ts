import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CITY_COORDINATES } from "@/lib/cities";

export async function POST(req: Request) {
  const supabase = await createClient();

console.log("AUTH HEADER VAR MI:", !!req.headers.get("Authorization"));

  // Önce Authorization header'dan token'ı al
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  let user = null;

  if (token) {
    const {
  data: { user: tokenUser },
  error: authError,
} = await supabase.auth.getUser(token);

console.log("TOKEN USER:", tokenUser?.id || null);
console.log("AUTH ERROR:", authError?.message || null);

user = tokenUser;
  } else {
    const {
      data: { user: cookieUser },
    } = await supabase.auth.getUser();

    user = cookieUser;
  }

  if (!user) {
    return NextResponse.json(
      { error: "Oturum bulunamadı." },
      { status: 401 }
    );
  }

  const b = await req.json();

  const city = String(b.city || "").trim();
  const country = String(b.country || "Türkiye").trim();

  const coordinates = CITY_COORDINATES[city];

  if (country === "Türkiye" && !coordinates) {
    return NextResponse.json(
      {
        error:
          "Şehir bulunamadı. Lütfen Türkiye'deki ilin tam adını yazınız.",
      },
      { status: 400 }
    );
  }

  const row = {
    id: user.id,

    full_name: b.full_name || null,
    bilsem_name: b.bilsem_name || null,

    graduation_year: b.graduation_year
      ? Number(b.graduation_year)
      : null,

    university: b.university || null,
    department: b.department || null,

    city,
    country,

    latitude: coordinates?.latitude ?? null,
    longitude: coordinates?.longitude ?? null,

    location_visibility: "city",

    bio: b.bio || null,

    interests: b.interests
      ? String(b.interests)
          .split(",")
          .map((x: string) => x.trim())
          .filter(Boolean)
      : [],

    mentoring_areas: b.mentoring_areas
      ? String(b.mentoring_areas)
          .split(",")
          .map((x: string) => x.trim())
          .filter(Boolean)
      : [],

    mentoring_needs: b.mentoring_needs || null,
    profession: b.profession || null,
    achievements: b.achievements || null,
    website: b.website || null,

    photo_url: null,
    status: "pending",
  };

  const { error } = await supabase
    .from("alumni")
    .upsert(row);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
  });
}