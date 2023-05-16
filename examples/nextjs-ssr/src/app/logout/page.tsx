import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { store } from "@/lib/store";

const handleLogout = async () => {
  // Get session ID from cookie
  const sessionId = cookies().get("sessionId")?.value || "";

  // Delete session from memory
  store.delete(String(sessionId));

  // Redirect to homepage
  redirect("/");
};

export default async function Logout() {
  await handleLogout();
  return <></>;
}
