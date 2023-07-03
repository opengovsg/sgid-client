import Link from "next/link";

const Error = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white rounded-md py-12 px-8 flex flex-col max-w-lg min-w-fit">
        <div id="user-info" className="text-xl mx-auto text-center mb-8">
          Error
        </div>
        <div>An error has occurred</div>
        <Link
          prefetch={false}
          href="/"
          className="w-full text-white cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 py-2 px-4 text-center mt-8"
        >
          Return to home
        </Link>
      </div>
    </main>
  );
};

export default Error;
