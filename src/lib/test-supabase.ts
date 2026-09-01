import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  const { error } = await supabase
    .from("test_connection")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Erro Supabase:", error);
    return;
  }

  console.log("Supabase conectado!");
}