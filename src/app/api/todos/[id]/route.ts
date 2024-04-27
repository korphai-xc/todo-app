import { createClient, isAuthenticated } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    await isAuthenticated();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = params.id;
  const supabase = createClient();

  const { data: todo, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: todo });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    await isAuthenticated();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = params.id;
  const formData = await request.formData();
  const title = formData.get("title");
  const desc = formData.get("description") ?? "";
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: updated, error } = await supabase
    .from("todos")
    .update({ title: title, ...(desc && { desc }) })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    await isAuthenticated();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = params.id;
  const supabase = createClient();

  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ status: "fail" }, { status: 500 });
  }

  return NextResponse.json({ status: "ok" });
}
