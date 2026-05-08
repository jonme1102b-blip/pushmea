import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const { name, email, password, role } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const created_at = new Date().toISOString();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }

    const { error: insertError } = await supabase.from("users").insert({
      user_id: data.user.id,
      created_at: created_at,
      name: name,
      role: role,
      email: email,
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }

    let roleInsert;

    if (role === "provider") {
      roleInsert = await supabase.from("providers").insert({
        provider_id: data.user.id,
        created_at: created_at,
        name: name,
      });
    }

    if (role === "agent") {
      roleInsert = await supabase.from("agents").insert({
        agent_id: data.user.id,
        created_at: created_at,
        name: name,
      });
    }

    if (role === "customer") {
      roleInsert = await supabase.from("customers").insert({
        customer_id: data.user.id,
        created_at: created_at,
        name: name,
      });
    }

    if (roleInsert?.error) {
      return new Response(JSON.stringify({ error: roleInsert.error.message }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        user_id: data.user.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
});
