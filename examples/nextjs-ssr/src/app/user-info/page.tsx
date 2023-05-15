import { store } from "@/lib/store";
import { cookies } from "next/headers";

const getUserInfo = async (sessionId: string) => {
  // Retrieve session from memory
  const session = store.get(sessionId);
  if (!session) {
    throw new Error("No session found");
  }
  return session;
};

export default async function LoggedIn() {
  const sessionId = cookies().get("sessionId")?.value;

  if (!sessionId) {
    throw new Error("Session ID not found in browser's cookies");
  }

  const { sgid, userInfo } = await getUserInfo(sessionId);
  if (!sgid || !userInfo) {
    throw new Error("User has not authenticated");
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="bg-white rounded-md py-12 px-8 flex flex-col max-w-lg min-w-fit">
        <div className="text-xl mx-auto text-center mb-8">User Info</div>
        <div className="w-full grid grid-cols-2 py-2 gap-4">
          <div className="w-full whitespace-nowrap">sgID</div>
          <div className="w-full">{sgid}</div>
        </div>
        {Object.entries(userInfo).map(([field, value]) => (
          <div className="w-full grid grid-cols-2 py-2 gap-4" key={field}>
            <div className="w-full whitespace-nowrap">{field}</div>
            <div className="w-full">{value}</div>
          </div>
        ))}
      </div>
      <a
        href="/api/logout"
        className="w-full text-white cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 py-2 px-4 text-center mt-8"
      >
        Logout
      </a>
    </main>
  );
}
