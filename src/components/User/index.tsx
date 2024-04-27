import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function User() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <p>Hello {data.user.email}</p>
      <div>
        <form action="/auth/signout" method="post">
          <button className="button block hover:text-blue-400" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
