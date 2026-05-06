import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Response(error.message, { status: 500 });
  if (!data) throw new Response("Forbidden: admin only", { status: 403 });
}

const createClientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(120),
});

export const createClientAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createClientSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { display_name: data.displayName },
    });
    if (error || !created.user) {
      throw new Response(error?.message ?? "Could not create user", { status: 400 });
    }
    const uid = created.user.id;

    // handle_new_user trigger inserts profile + 'client' role automatically.
    // Make sure display_name is set even if metadata path missed it.
    await supabaseAdmin
      .from("profiles")
      .update({ display_name: data.displayName, email: data.email })
      .eq("user_id", uid);

    return { userId: uid, email: data.email, displayName: data.displayName };
  });
