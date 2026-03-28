import { supabase } from "@/integrations/supabase/client";

export interface VisitRequest {
  id: string;
  name: string;
  grade: string;
  phone: string;
  reason: string;
  date: string;
  time: string;
  method: string;
  prayer: string;
  created_at: string;
}

export async function getRequests(): Promise<VisitRequest[]> {
  const { data, error } = await supabase
    .from("visit_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch requests:", error);
    return [];
  }
  return (data ?? []).map((r) => ({
    ...r,
    prayer: r.prayer ?? "",
  }));
}

export async function addRequest(
  request: Omit<VisitRequest, "id" | "created_at">
): Promise<boolean> {
  const { error } = await supabase.from("visit_requests").insert(request);
  if (error) {
    console.error("Failed to add request:", error);
    return false;
  }
  return true;
}

export async function deleteRequest(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("visit_requests")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Failed to delete request:", error);
    return false;
  }
  return true;
}

// Admin auth via Supabase Auth
export async function adminLogin(
  email: string,
  password: string
): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return !error;
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
}

export async function adminLogout(): Promise<void> {
  await supabase.auth.signOut();
}
