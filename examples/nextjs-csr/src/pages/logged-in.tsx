import Link from "next/link";
import { useEffect, useState } from "react";

type UserInfoRes = {
  sgid?: string;
  userInfo?: Record<string, string>;
  state?: string;
};

const LoggedIn = () => {
  const [data, setData] = useState<UserInfoRes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/userinfo", { credentials: "include" });
        const data = (await res.json()) as UserInfoRes;
        setData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    };
    getUserInfo();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>{`Error: ${error}`}</div>;
    }

    return (
      <>
        <div className="text-xl mx-auto text-center mb-8">User Info</div>
        {data?.sgid ? (
          <div className="w-full grid grid-cols-2 py-2 gap-4">
            <div className="w-full whitespace-nowrap">sgID</div>
            <div className="w-full">{data.sgid}</div>
          </div>
        ) : null}
        {Object.entries(data?.userInfo ?? {}).map(([field, value]) => (
          <div className="w-full grid grid-cols-2 py-2 gap-4" key={field}>
            <div className="w-full whitespace-nowrap">{field}</div>
            <div className="w-full">{value}</div>
          </div>
        ))}
        {data?.state ? (
          <div className="w-full grid grid-cols-2 py-2 gap-4">
            <div className="w-full whitespace-nowrap">
              Favourite ice cream flavour
            </div>
            <div className="w-full">{data.state}</div>
          </div>
        ) : null}
        <Link
          prefetch={false}
          href="/api/logout"
          className="w-full text-white cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 py-2 px-4 text-center mt-8"
        >
          Logout
        </Link>
      </>
    );
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white rounded-md py-12 px-8 flex flex-col max-w-lg min-w-fit">
        {renderContent()}
      </div>
    </main>
  );
};

export default LoggedIn;
