import { createClient, isAuthenticated } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await isAuthenticated();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const searchParams = request.nextUrl.searchParams;
  let limit = Number(searchParams.get("limit")); // 10
  let skip = Number(searchParams.get("skip")); // 0
  limit = limit > 0 && limit < 100 ? limit - 1 : 9;
  skip = skip > 0 ? skip : 0; // 10

  const supabase = createClient();
  const {
    data: todos,
    count,
    error,
  } = await supabase
    .from("todos")
    .select("*", { count: "exact" })
    .eq("completed", false)
    .range(skip, skip + limit)
    .order("id", { ascending: true });

  return NextResponse.json({
    todos,
    total: count,
    limit: limit + 1,
    offset: skip,
  });
}

export async function POST(request: NextRequest) {
  let user;
  try {
    const data = await isAuthenticated();
    user = data.user;
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await request.formData();
  const title = formData.get("title");
  const desc = formData.get("description");
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("todos")
    .insert([{ user_id: user.id, title: title, ...(desc && { desc }) }])
    .select();

  return NextResponse.json({ data });
}
