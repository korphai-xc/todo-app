import { createClient, isAuthenticated } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  let user;
  try {
    const data = await isAuthenticated();
    user = data.user;
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = params.id;

  const supabase = createClient();

  const { data: updated, error } = await supabase
    .from("todos")
    .update({ completed: true })
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  return NextResponse.json({ updated });
}
