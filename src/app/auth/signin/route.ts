import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const supabase = createClient();
  const { data: user, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  //   revalidatePath("/", "layout");
  return NextResponse.json(
    { token: user.session.access_token },
    { status: 200 }
  );
}
