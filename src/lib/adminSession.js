import { supabase } from "./supabase";

export async function getAdminSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Not authenticated. Please log in again.");
  }
  return session;
}
