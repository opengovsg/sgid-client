import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type UserInfoRes = {
  sub?: string;
  userInfo?: Record<string, string>;
  state?: string;
};

const LoggedIn = () => {
  const getUserInfo = async () => {
    const res = await fetch("/api/userinfo", { credentials: "include" });
    return (await res.json()) as UserInfoRes;
  };

  const { isLoading, error, data } = useQuery<UserInfoRes>(["userinfo"], {
    queryFn: getUserInfo,
    retry: false
  });

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>{`Error: ${error}`}</div>;
    }

    return (
      <>
        <div id="user-info" className="text-xl mx-auto text-center mb-8">
          User Info
        </div>
        {data?.sub ? (
          <div className="w-full grid grid-cols-2 py-2 gap-4">
            <div className="w-full whitespace-nowrap">sgID</div>
            <div className="w-full">{data.sub}</div>
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
