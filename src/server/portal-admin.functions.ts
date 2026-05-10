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

const createAccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const createClientAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createAccountSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error || !created.user) {
      throw new Response(error?.message ?? "Could not create user", { status: 400 });
    }

    // The on_auth_user_created trigger inserts the 'client' role automatically.
    return { userId: created.user.id, email: data.email };
  });

export const createAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createAccountSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error || !created.user) {
      throw new Response(error?.message ?? "Could not create user", { status: 400 });
    }

    const userId = created.user.id;

    // The on_auth_user_created trigger inserts a 'client' role row. Replace it
    // with 'admin' so the new account has admin privileges.
    const { error: deleteErr } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "client");
    if (deleteErr) {
      throw new Response(deleteErr.message, { status: 500 });
    }

    const { error: insertErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (insertErr) {
      throw new Response(insertErr.message, { status: 500 });
    }

    return { userId, email: data.email };
  });
